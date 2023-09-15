import cors from "cors";
import express from "express";
import { userRouter } from "./router/user-router";
import { productsRouter } from "./router/products-router";
import { paymentRouter } from "./router/payment-router";

const port = process.env.PORT || 4242;

const app = express();

app.use( cors() );
app.use( express.json() );

const server = app.listen( port, () => {
    if ( server ) console.log( `The server is running on localhost:${port}` );
    else console.log( 'Error running the server' );
} );

app.use( userRouter )
app.use( productsRouter )
app.use( paymentRouter )

