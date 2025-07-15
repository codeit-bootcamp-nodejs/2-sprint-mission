const { Prisma } = require("../generated/client");

module.exports = function(handler){
    return async (req, res, next) => {
        try{
            await handler(req, res, next);
        } catch(err) {
            const ec = err.code;
            const errRes = {message:err};
            if(err instanceof Prisma.PrismaClientInitializationError){
                if(['P1002', 'P1008'].includes(ec)) res.status(504).json(errRes);
                else if(['P1001'].includes(ec)) res.status(503).json(errRes);
                else if(['P1009'].includes(ec)) res.status(409).json(errRes);
                else if(['P1010'].includes(ec)) res.status(403).json(errRes);
                else if(['P1011'].includes(ec)) res.status(502).json(errRes);
                else res.status(500).json(errRes);
            } else if( err instanceof StructError || err instanceof Prisma.PrismaClientValidationError) {
                res.status(400).json(errRes);
            } else if( err instanceof PrismaClientKnownRequestError){
                if(['P2000', 'P2003', 'P2004','P2006', 'P2007','P2008','P2009','P2011','P2012','P2013', 'P2016', 'P2019', 'P2020','P2030','P2033', 'P1016','P2035'].includes(ec)) res.status(400).json(errRes); // client send invalid data
                else if(['P2002', 'P2003','P2014','P2034'].includes(ec))
                    res.status(409).json(errRes); // unique field dup
                else if(['P2001','P2025', 'P2018', 'P2015'].includes(ec)) res.status(404).json(errRes); // no resource
                else if(['P2026'].includes(ec)) res.status(501).json(errRes);
                else if(['P2029'].includes(ec)) res.status(413).json(errRes);
                else res.status(500).json(errRes);
            } else if (err instanceof Prisma.PrismaClientUnknownRequestError){
                if(['P2036'].includes(ec)) res.status(502).json(errRes);
                else if(['P1017', 'P2024','P2037'].includes(ec)) res.status(503).json(errRes);
                else res.status(500).json(errRes);
            } else {
                res.statuss(500).json(errRes);
            }
        }
    };
}