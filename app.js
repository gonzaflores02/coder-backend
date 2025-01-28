import express from "express"
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter)

app.listen(port, () => {
    console.log("Servidor activo: " + port);
    
})

