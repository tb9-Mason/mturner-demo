export interface GameState {
  currentState: 'clean' | 'started' | 'completed';
  score: number;
  timeRemaining: number;
}
