
/// <reference types="vite/client" />

// Add type definitions for Speech Recognition API
interface Window {
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
}

// Define the SpeechRecognition interface
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  new(): SpeechRecognition;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEventResult {
  isFinal?: boolean;
  [index: number]: {
    transcript: string;
  };
}

interface SpeechRecognitionEvent extends Event {
  results: {
    item(index: number): SpeechRecognitionEventResult;
    [index: number]: SpeechRecognitionEventResult;
    length: number;
  };
}

