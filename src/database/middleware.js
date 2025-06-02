import jwt from 'jsonwebtoken';
const SECRET ="SECRETO" //haceer env

export function verificarToken(req, res, next){
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
if (!token){
    return res.status(401).json({message: "Token invalido"})
}

try{
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded //guardar payload del token
    next()
}catch (err){
    if (err.name === 'TokenExpiredError'){
        return res.statis(401).json({message: "Token expirado"})
    }
    return res.status(401).json({ message:" Token invalido"})
}
}