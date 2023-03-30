import TokenGenerator from 'uuid-token-generator';

const TG = new TokenGenerator(512, TokenGenerator.BASE62);

export const GenerateAToken = async () => {
  return TG.generate();
}
