import { gql } from '../../../gql';

export const MAKE_MOVE = gql(`
    mutation SendMove($data: MakeMoveInput!) {
        makeMove(data: $data) {
            board
            gameOver
            winner
        }
    }
`);
