import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function VoiceAssistant() {
  const { rooms, bookings, guests } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'assistant', message: string}>>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        handleVoiceCommand(speechResult);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    let responseText = '';

    // Add user message to conversation
    setConversation(prev => [...prev, { type: 'user', message: command }]);

    if (lowerCommand.includes('available rooms') || lowerCommand.includes('room availability')) {
      const availableRooms = rooms.filter(room => room.status === 'Available');
      responseText = `We currently have ${availableRooms.length} available rooms. `;
      
      const roomTypes = availableRooms.reduce((acc: any, room) => {
        acc[room.type] = (acc[room.type] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(roomTypes).forEach(([type, count]) => {
        responseText += `${count} ${type} room${count !== 1 ? 's' : ''}, `;
      });
      
      responseText = responseText.slice(0, -2) + '.';
    } 
    else if (lowerCommand.includes('check in') || lowerCommand.includes('check-in')) {
      const confirmedBookings = bookings.filter(booking => booking.status === 'Confirmed');
      responseText = `There are ${confirmedBookings.length} guests ready for check-in today.`;
    }
    else if (lowerCommand.includes('check out') || lowerCommand.includes('check-out')) {
      const checkedInBookings = bookings.filter(booking => booking.status === 'Checked In');
      responseText = `There are ${checkedInBookings.length} guests currently checked in who may need to check out.`;
    }
    else if (lowerCommand.includes('total rooms')) {
      responseText = `Kamara Lake View Hotel has a total of ${rooms.length} rooms.`;
    }
    else if (lowerCommand.includes('occupied rooms')) {
      const occupiedRooms = rooms.filter(room => room.status === 'Occupied');
      responseText = `Currently ${occupiedRooms.length} rooms are occupied.`;
    }
    else if (lowerCommand.includes('room prices') || lowerCommand.includes('pricing')) {
      const standardPrice = rooms.find(room => room.type === 'Standard')?.price || 120;
      const deluxePrice = rooms.find(room => room.type === 'Deluxe')?.price || 180;
      const lakeViewPrice = rooms.find(room => room.type === 'Lake View')?.price || 250;
      
      responseText = `Our room rates are: Standard rooms at $${standardPrice} per night, Deluxe rooms at $${deluxePrice} per night, and Lake View rooms at $${lakeViewPrice} per night.`;
    }
    else if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      responseText = 'Hello! I\'m Emirald, your AI assistant for Kamara Lake View Hotel. I can help you with room availability, bookings, check-ins, and general hotel information. How can I assist you today?';
    }
    else if (lowerCommand.includes('help')) {
      responseText = 'I can help you with: checking room availability, viewing check-in and check-out information, room pricing, total room counts, and general hotel inquiries. Just ask me anything about the hotel operations!';
    }
    else {
      responseText = 'I\'m sorry, I didn\'t understand that request. I can help you with room availability, check-ins, check-outs, pricing, and general hotel information. Could you please rephrase your question?';
    }

    setResponse(responseText);
    setConversation(prev => [...prev, { type: 'assistant', message: responseText }]);
    speak(responseText);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transcript.trim()) {
      handleVoiceCommand(transcript);
      setTranscript('');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emirald AI Assistant</h1>
            <p className="text-gray-600">Your intelligent hotel management companion</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Voice Controls */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Mic className="w-5 h-5 mr-2" />
            Voice Commands
          </h2>
          
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 transition-all duration-300 ${
              isListening ? 'bg-red-100 animate-pulse' : 'bg-blue-100'
            }`}>
              {isListening ? (
                <Mic className="w-12 h-12 text-red-600" />
              ) : (
                <MicOff className="w-12 h-12 text-blue-600" />
              )}
            </div>
            
            <div className="space-y-3">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isListening ? 'Stop Listening' : 'Start Voice Command'}
              </button>
              
              <div className="flex justify-center space-x-2">
                <button
                  onClick={isSpeaking ? stopSpeaking : () => speak(response)}
                  disabled={!response}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-md transition-colors flex items-center space-x-2"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeaking ? 'Stop' : 'Repeat'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Text Input Alternative */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Or Type Your Question</h3>
            <form onSubmit={handleTextSubmit} className="space-y-3">
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Ask about room availability, check-ins, pricing..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Ask Emirald
              </button>
            </form>
          </div>
        </div>

        {/* Conversation History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Conversation
          </h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conversation.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Start a conversation with Emirald!</p>
                <div className="mt-4 text-sm text-gray-400">
                  <p>Try asking:</p>
                  <ul className="mt-2 space-y-1">
                    <li>"How many rooms are available?"</li>
                    <li>"What are the room prices?"</li>
                    <li>"Who needs to check in today?"</li>
                    <li>"How many rooms are occupied?"</li>
                  </ul>
                </div>
              </div>
            ) : (
              conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {conversation.length > 0 && (
            <button
              onClick={() => setConversation([])}
              className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md transition-colors"
            >
              Clear Conversation
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats for Voice Assistant */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Hotel Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{rooms.filter(r => r.status === 'Available').length}</p>
            <p className="text-sm text-gray-600">Available Rooms</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'Confirmed').length}</p>
            <p className="text-sm text-gray-600">Pending Check-ins</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{rooms.filter(r => r.status === 'Occupied').length}</p>
            <p className="text-sm text-gray-600">Occupied Rooms</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{guests.length}</p>
            <p className="text-sm text-gray-600">Total Guests</p>
          </div>
        </div>
      </div>
    </div>
  );
}