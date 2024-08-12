
import JWT from "jsonwebtoken";

const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

const generarLWT = id => JWT.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });


export {
  generarId,
  generarLWT
}