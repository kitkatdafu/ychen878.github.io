"""
pip install edge-tts websockets numpy torchaudio
"""

import asyncio
import base64
import json
import logging
import threading
import time
from queue import Queue

# Dependencies
import edge_tts
import numpy as np
import websockets

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EdgeTTSModel:
    """High-quality TTS using Microsoft Edge TTS with native word boundary alignment"""

    def __init__(self):
        self.edge_tts = edge_tts
        self.voice = "en-US-AriaNeural"  # High-quality voice
        self.sample_rate = 24000  # Edge TTS nominal sample rate
        self.actual_sample_rate = 24000  # Will be updated when loading audio
        self.last_word_boundaries = []  # Store Edge TTS word timing data
        logger.info("✅ Edge TTS initialized successfully!")

    def synthesize(self, text):
        """Synthesize speech using Edge TTS with word boundary capture"""
        if not text.strip():
            return np.array([])

        try:
            result_queue = Queue()

            def run_in_thread():
                try:
                    # Create new event loop for this thread
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)

                    # Run the async synthesis
                    result = loop.run_until_complete(self._async_synthesize(text))
                    audio_data, word_boundaries = result
                    result_queue.put(("success", (audio_data, word_boundaries)))

                    loop.close()
                except Exception as e:
                    result_queue.put(("error", e))

            # Start thread and wait for result
            thread = threading.Thread(target=run_in_thread)
            thread.start()
            thread.join(timeout=30)  # 30 second timeout

            if thread.is_alive():
                logger.error("Edge TTS synthesis timed out")
                return np.array([])

            # Get result from queue
            try:
                result_type, result_data = result_queue.get_nowait()
                if result_type == "error":
                    raise result_data

                audio_data, word_boundaries = result_data
                self.last_word_boundaries = word_boundaries  # Store for alignment

            except Exception as e:
                logger.error(f"No result from Edge TTS thread: {e}")
                return np.array([])

            if audio_data:
                # Convert Edge TTS audio (MP3/OGG) to numpy array
                audio_array, actual_sample_rate = self._convert_audio_data(audio_data)

                if audio_array is not None:
                    # Resample to 44.1kHz if needed
                    if actual_sample_rate != 44100:
                        audio_array = self._resample_audio(
                            audio_array, actual_sample_rate, 44100
                        )

                    return audio_array
                else:
                    logger.error("Failed to convert Edge TTS audio data")
                    return np.array([])
            else:
                return np.array([])

        except Exception as e:
            logger.error(f"Edge TTS synthesis error: {e}")
            return np.array([])

    async def _async_synthesize(self, text):
        """Async helper for Edge TTS with word boundary timing"""
        try:
            communicate = self.edge_tts.Communicate(text, self.voice)
            audio_data = b""
            word_boundaries = []

            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_data += chunk["data"]
                elif chunk["type"] == "WordBoundary":
                    # Edge TTS provides word boundary timing!
                    word_boundaries.append(
                        {
                            "text": chunk.get("text", ""),
                            "audio_offset": chunk.get(
                                "audio_offset", 0
                            ),  # In 100ns units
                            "duration": chunk.get("duration", 0),  # In 100ns units
                            "text_offset": chunk.get("text_offset", 0),
                            "text_length": chunk.get("text_length", 0),
                        }
                    )

            return audio_data, word_boundaries

        except Exception as e:
            logger.error(f"Async synthesis error: {e}")
            return b"", []

    def _convert_audio_data(self, audio_data):
        """Convert Edge TTS audio data to numpy array"""
        try:
            import os
            import tempfile

            # Create temporary file for audio data
            with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_path = temp_file.name

            try:
                # Try using torchaudio to load the audio file
                try:
                    import torchaudio

                    waveform, sample_rate = torchaudio.load(temp_path)

                    # Convert to mono if stereo
                    if waveform.shape[0] > 1:
                        waveform = waveform.mean(dim=0, keepdim=True)

                    # Convert to numpy
                    audio_array = waveform.squeeze().numpy()

                    # Update sample rate from loaded file
                    self.actual_sample_rate = sample_rate

                    return audio_array, sample_rate

                except ImportError:
                    logger.error("torchaudio not available for audio conversion")
                    return None, None

            finally:
                # Clean up temp file
                try:
                    os.unlink(temp_path)
                except:
                    pass

        except Exception as e:
            logger.error(f"Audio conversion error: {e}")
            return None, None

    def _resample_audio(self, audio, orig_sr, target_sr):
        """Resample audio to target sample rate"""
        if orig_sr == target_sr:
            return audio
        ratio = target_sr / orig_sr
        new_length = int(len(audio) * ratio)
        indices = np.linspace(0, len(audio) - 1, new_length)
        return np.interp(indices, np.arange(len(audio)), audio)


class TTSWebSocketServer:
    """WebSocket server for TTS with Edge TTS and native word boundary alignment"""

    def __init__(self, host="localhost", port=8765):
        self.host = host
        self.port = port

        # Initialize Edge TTS model
        logger.info("🔄 Loading Edge TTS...")
        self.tts_model = EdgeTTSModel()
        logger.info(
            "✅ Successfully loaded Edge TTS with native word boundary alignment!"
        )

    async def handle_client(self, websocket, path):
        """Handle individual WebSocket client connections"""
        logger.info(f"New client connected from {websocket.remote_address}")

        # Client state
        text_buffer = ""

        try:
            async for message in websocket:
                start_time = time.time()

                try:
                    data = json.loads(message)
                    text = data.get("text", "")
                    flush = data.get("flush", False)

                    # Handle connection initialization (first chunk with single space)
                    if text == " " and not text_buffer:
                        logger.info("Client initialized connection")
                        continue

                    # Handle connection termination (empty text)
                    if text == "":
                        logger.info("Client requested connection termination")
                        break

                    # Add text to buffer
                    text_buffer += text

                    # Check if we should generate audio
                    should_generate = False
                    text_to_generate = ""

                    if flush:
                        # If flush requested, generate everything in buffer
                        should_generate = True
                        text_to_generate = text_buffer
                        text_buffer = ""  # Clear buffer completely
                    else:
                        # Check if we have complete words to generate
                        complete_text, remaining_text = self._extract_complete_words(
                            text_buffer
                        )

                        if complete_text and len(complete_text.strip()) > 0:
                            should_generate = True
                            text_to_generate = complete_text
                            text_buffer = (
                                remaining_text  # Keep incomplete words in buffer
                            )

                    # Generate audio for complete words only
                    if should_generate and text_to_generate.strip():
                        # Generate audio
                        audio_data = self.tts_model.synthesize(text_to_generate)

                        if len(audio_data) > 0:
                            # Convert to required format (44.1kHz, 16-bit, mono PCM)
                            audio_pcm = self._to_pcm16(audio_data)
                            audio_b64 = base64.b64encode(audio_pcm).decode("utf-8")

                            # Use Edge TTS native timing
                            if (
                                hasattr(self.tts_model, "last_word_boundaries")
                                and self.tts_model.last_word_boundaries
                            ):
                                alignment = self._generate_edgetts_alignment(
                                    text_to_generate,
                                    len(audio_data),
                                    44100,
                                    self.tts_model.last_word_boundaries,
                                )
                                logger.info(
                                    "Using Edge TTS native word boundary alignment"
                                )
                            else:
                                alignment = self._generate_simple_alignment(
                                    text_to_generate, len(audio_data), 44100
                                )
                                logger.info("Using simple fallback alignment")

                            # Send response
                            response = {"audio": audio_b64, "alignment": alignment}

                            await websocket.send(json.dumps(response))

                            # Calculate and log latency
                            latency = (time.time() - start_time) * 1000
                            logger.info(
                                f"Generated audio for '{text_to_generate[:50]}...' in {latency:.0f}ms"
                            )

                except json.JSONDecodeError:
                    logger.error("Received invalid JSON")
                except Exception as e:
                    logger.error(f"Error processing message: {e}")

        except websockets.exceptions.ConnectionClosed:
            logger.info("Client disconnected")
        except Exception as e:
            logger.error(f"Connection error: {e}")

    def _extract_complete_words(self, text_buffer):
        """Extract complete words from buffer, leaving incomplete words for next chunk"""
        if not text_buffer.strip():
            return "", ""

        # Find the last complete word boundary
        word_boundary_chars = [" ", ".", ",", "!", "?", ";", ":", "\n", "\t"]

        # Find the last word boundary in the buffer
        last_boundary_pos = -1
        for i in range(len(text_buffer) - 1, -1, -1):
            if text_buffer[i] in word_boundary_chars:
                last_boundary_pos = i
                break

        # If no word boundary found, keep everything in buffer (incomplete word)
        if last_boundary_pos == -1:
            if len(text_buffer) > 100:  # Very long "word" - probably an error
                return text_buffer, ""
            else:
                return "", text_buffer

        # Split at the last word boundary
        complete_text = text_buffer[: last_boundary_pos + 1]
        remaining_text = text_buffer[last_boundary_pos + 1 :]

        # Clean up: ensure we have meaningful content
        if not complete_text.strip():
            return "", text_buffer

        # Don't generate for just punctuation or spaces
        if complete_text.strip() in [".", ",", "!", "?", ";", ":"]:
            return "", text_buffer

        # Special handling for sentence endings - include them
        if complete_text.rstrip().endswith((".", "!", "?")):
            pass  # Complete sentence, definitely generate
        elif len(complete_text.strip()) < 3:
            return "", text_buffer  # Very short text, wait for more

        return complete_text, remaining_text

    def _generate_edgetts_alignment(
        self, text, audio_samples, sample_rate, word_boundaries
    ):
        """Generate precise alignment using Edge TTS word boundary data"""
        chars = list(text)

        if len(chars) == 0:
            return {"chars": [], "char_start_times_ms": [], "char_durations_ms": []}

        if not word_boundaries:
            # Fallback if no boundary data
            return self._generate_simple_alignment(text, audio_samples, sample_rate)

        logger.info(f"Using Edge TTS word boundaries: {len(word_boundaries)} words")

        # Convert Edge TTS timing (100ns units) to milliseconds
        word_timings = []
        for boundary in word_boundaries:
            word_start_ms = boundary["audio_offset"] / 10000  # Convert 100ns to ms
            word_duration_ms = boundary["duration"] / 10000
            word_text = boundary.get("text", "")
            text_start = boundary.get("text_offset", 0)
            text_length = boundary.get("text_length", 0)

            word_timings.append(
                {
                    "start_ms": word_start_ms,
                    "duration_ms": word_duration_ms,
                    "text": word_text,
                    "text_start": text_start,
                    "text_length": text_length,
                }
            )

        # Map word boundaries to character positions
        char_start_times = []
        char_durations = []

        current_word_idx = 0
        text_position = 0

        for i, char in enumerate(chars):
            # Find which word this character belongs to
            while (
                current_word_idx < len(word_timings)
                and text_position
                >= word_timings[current_word_idx]["text_start"]
                + word_timings[current_word_idx]["text_length"]
            ):
                current_word_idx += 1

            if current_word_idx < len(word_timings):
                word = word_timings[current_word_idx]

                # Calculate position within the word
                word_char_start = word["text_start"]
                word_char_end = word_char_start + word["text_length"]

                if text_position >= word_char_start and text_position < word_char_end:
                    # Character is within this word
                    char_position_in_word = text_position - word_char_start
                    word_char_count = word["text_length"]

                    if word_char_count > 0:
                        # Distribute word duration across characters
                        char_start_in_word = (
                            char_position_in_word / word_char_count
                        ) * word["duration_ms"]
                        char_duration = word["duration_ms"] / word_char_count
                        char_start_time = word["start_ms"] + char_start_in_word
                    else:
                        char_start_time = word["start_ms"]
                        char_duration = word["duration_ms"]
                else:
                    # Character is between words (space/punctuation)
                    if char.isspace():
                        char_duration = 30  # Short pause for spaces
                        if current_word_idx > 0:
                            prev_word = word_timings[current_word_idx - 1]
                            char_start_time = (
                                prev_word["start_ms"] + prev_word["duration_ms"]
                            )
                        else:
                            char_start_time = 0
                    elif char in ".,!?;:":
                        char_duration = (
                            100 if char in ".!?" else 50
                        )  # Punctuation pause
                        if current_word_idx > 0:
                            prev_word = word_timings[current_word_idx - 1]
                            char_start_time = (
                                prev_word["start_ms"] + prev_word["duration_ms"]
                            )
                        else:
                            char_start_time = 0
                    else:
                        # Fallback for other characters
                        char_start_time = (
                            word["start_ms"]
                            if current_word_idx < len(word_timings)
                            else 0
                        )
                        char_duration = 50
            else:
                # Beyond all words, use end timing
                if word_timings:
                    last_word = word_timings[-1]
                    char_start_time = last_word["start_ms"] + last_word["duration_ms"]
                else:
                    char_start_time = i * 50  # Fallback
                char_duration = 50

            char_start_times.append(int(char_start_time))
            char_durations.append(int(char_duration))
            text_position += 1

        return {
            "chars": chars,
            "char_start_times_ms": char_start_times,
            "char_durations_ms": char_durations,
        }

    def _generate_simple_alignment(self, text, audio_samples, sample_rate):
        """Simple fallback alignment when Edge TTS word boundaries are not available"""
        chars = list(text)
        audio_duration_ms = (audio_samples / sample_rate) * 1000

        if len(chars) == 0:
            return {"chars": [], "char_start_times_ms": [], "char_durations_ms": []}

        # Simple uniform distribution
        char_duration = audio_duration_ms / len(chars)
        char_start_times = []
        char_durations = []

        for i, char in enumerate(chars):
            start_time = i * char_duration
            duration = char_duration

            # Basic adjustments
            if char.isspace():
                duration *= 0.5
            elif char in ".,!?;:":
                duration *= 1.5

            char_start_times.append(int(start_time))
            char_durations.append(int(duration))

        return {
            "chars": chars,
            "char_start_times_ms": char_start_times,
            "char_durations_ms": char_durations,
        }

    def _to_pcm16(self, audio_float):
        """Convert float32 audio to 16-bit PCM bytes"""
        # Ensure audio is in [-1, 1] range
        audio_float = np.clip(audio_float, -1.0, 1.0)

        # Convert to 16-bit integers
        audio_int16 = (audio_float * 32767).astype(np.int16)

        # Convert to bytes
        return audio_int16.tobytes()

    async def start_server(self):
        """Start the WebSocket server"""
        logger.info(f"Starting TTS WebSocket server on {self.host}:{self.port}")

        async with websockets.serve(self.handle_client, self.host, self.port):
            logger.info("Server is running. Press Ctrl+C to stop.")
            await asyncio.Future()  # Run forever


def main():
    """Main entry point"""
    server = TTSWebSocketServer(host="0.0.0.0", port=8765)

    try:
        asyncio.run(server.start_server())
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")


if __name__ == "__main__":
    main()
