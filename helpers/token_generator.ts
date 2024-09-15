import { v4 as uuidv4 } from 'uuid';

export const GenerateAToken = async () => {
  return uuidv4();
}
