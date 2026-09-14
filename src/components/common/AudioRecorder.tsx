import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AudioRecorderProps {
  onTranscriptionComplete: (transcript: string, durationSeconds: number) => void;
  disabled?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onTranscriptionComplete,
  disabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setTranscript(currentTranscript.trim());
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error event:', event.error);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition could not be initialized:', err);
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);
    setTranscript('');
    setAudioUrl(null);
    audioChunksRef.current = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('Microphone recording is not supported in this browser. Please type your response below.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start recognition if available
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsTranscribing(true);
        } catch {
          // Already started or busy
        }
      }

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Microphone access was denied. Please allow microphone permissions in browser settings or use the written response option.');
      } else {
        setErrorMessage('Could not initialize audio recording device. You can type your response instead.');
      }
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (recognitionRef.current && isTranscribing) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignored
      }
      setIsTranscribing(false);
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const resetRecording = () => {
    stopRecording();
    setAudioUrl(null);
    setTranscript('');
    setRecordingTime(0);
    setErrorMessage(null);
  };

  const handleConfirmTranscript = () => {
    if (!transcript.trim()) {
      setErrorMessage('No spoken words were transcribed. Please speak clearly or write your response manually.');
      return;
    }
    onTranscriptionComplete(transcript.trim(), recordingTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`flex h-3 w-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-stone-300'}`} />
          <span className="text-sm font-semibold text-stone-900">
            {isRecording ? 'Recording Spoken Response...' : audioUrl ? 'Recording Complete' : 'Vocal Practice Mode'}
          </span>
        </div>
        <div className="font-mono text-sm font-medium text-stone-600">
          {formatTime(recordingTime)}
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Control Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {!isRecording && !audioUrl && (
          <button
            type="button"
            id="audio-start-btn"
            disabled={disabled}
            onClick={startRecording}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Mic className="h-4 w-4" />
            <span>Record Voice</span>
          </button>
        )}

        {isRecording && (
          <button
            type="button"
            id="audio-stop-btn"
            onClick={stopRecording}
            className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 transition-colors"
          >
            <Square className="h-4 w-4 fill-current" />
            <span>Stop Recording</span>
          </button>
        )}

        {audioUrl && !isRecording && (
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <audio src={audioUrl} controls className="h-10 max-w-[240px]" />
            <button
              type="button"
              onClick={resetRecording}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Record Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Live / Generated Transcript Review */}
      {(transcript || isRecording) && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
            <span>Speech Transcript Review:</span>
            <span className="text-stone-500 font-normal">You can edit the transcript below before submitting</span>
          </div>
          <textarea
            id="audio-transcript-editor"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={3}
            placeholder={isRecording ? 'Listening and transcribing your words...' : 'Your spoken words will appear here...'}
            className="w-full rounded-lg border border-stone-200 p-3 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />

          {audioUrl && (
            <button
              type="button"
              id="audio-use-transcript-btn"
              onClick={handleConfirmTranscript}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Apply Transcript to Submission</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
