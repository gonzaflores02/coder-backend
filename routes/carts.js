import { Router } from "express"
import fs from 'fs';


const getIdCart = () => {
    return carts.length + 1;
}

const cartsRouter = Router();
let carts = JSON.parse(fs.readFileSync("./routes/carts.json", "utf-8"));
let products = JSON.parse(fs.readFileSync("./routes/products.json", "utf-8"));

cartsRouter.get("/", (req, res) => {
    const limit = req.query.limit;
    if(!isNaN(limit) && limit > 0){
        res.send(carts.slice(0, limit))
    } else{
    res.send(carts);
}
})

cartsRouter.post("/", (req, res) => {
    const newCart = {id:getIdCart(), products:[]}
    carts.push(newCart)
    res.send({"status": "ok", "mensaje" : "El carrito se creo correctamente", carts})
})

cartsRouter.get("/:cid", (req, res) => {
    const {cid} = req.params
    if(isNaN(cid)){
        return res.status(400).send({"status" : "error", "mensaje" : "El id " + cid + " " + "No es un numero" })
    } else{
    const carrito = carts.find(item => item.id == cid)

    res.send(carrito ? carrito : {"status" : "error", "mensaje" : "No se encontro el carrito con el id " + cid})
}
})

cartsRouter.post("/:cid/products/:pid", (req, res) => {
    const {cid, pid} = req.params;

    const carrito = carts.find(item => item.id == cid)
    const producto = products.find(item => item.id == pid)

    

    
    if(isNaN(cid)){
        return res.status(400).send({"status" : "error", "mensaje" : "El id del carrito tiene que ser un numero"})
    }
    if(isNaN(pid)){
        return res.status(400).send({"status" : "error", "mensaje" : "El id del producto tiene que ser un numero"})
    }
    if(!producto){
        return res.status(400).send({"status" : "error", "mensaje" : "El producto con el id " + pid + " no existe"})
    }
    if(!carrito){
        return res.status(400).send({"status" : "error", "mensaje" : "El carrito con el id " + cid + " no existe"})
    }

    const productoExistente = carrito.products.find(item => item.product == pid)


    if(productoExistente){
        productoExistente.quantity += 1
        res.send({"status" : "ok" , "mensaje" : "Se incremento la cantidad del producto en el carrito con id " + cid})
    }else{
        const addProducto = {product: Number(pid), quantity:1}


        carrito.products.push(addProducto)
        res.send({"status" : "ok", "mensaje" : "El producto se agrego correctamente al carrito con id " + cid})
    }
    


})

cartsRouter.delete("/:cid", (req, res) => {
    const {cid} = req.params
    const carrito = carts.find(item => item.id == cid)

    if(!carrito){
        return res.status(400).send({"status": "error", "mensaje": "No se encontró el carrito con el id " + cid})
    }
    carts = carts.filter(item => item.id != cid)
    res.send({"status" : "ok", "mensaje" : "El carrito se elimino correctamente"})
})

cartsRouter.delete("/:cid/products/:pid", (req, res) => {
    const {cid, pid} = req.params;

    const carrito = carts.find(item => item.id == cid)
    const producto = products.find(item => item.id == pid)
    const productoExistente = carrito.products.find(item => item.product == pid)

    if(isNaN(cid)){
        return res.status(400).send({"status" : "error", "mensaje" : "El id del carrito tiene que ser un numero"})
    }
    if(isNaN(pid)){
        return res.status(400).send({"status" : "error", "mensaje" : "El id del producto tiene que ser un numero"})
    }
    if(!producto){
        return res.status(400).send({"status" : "error", "mensaje" : "El producto con el id " + pid + " no existe"})
    }
    if(!carrito){
        return res.status(400).send({"status" : "error", "mensaje" : "El carrito con el id " + cid + " no existe"})
    }
    if(!productoExistente){
        return res.status(400).send({"status" : "error", "mensaje" : "El producto con el id " + pid + " no existe dentro del carrito"})
    }
    
    carrito.products = carrito.products.filter(item => item.product != pid)
    res.send({"status" : "ok", "mensae" : "El producto se elimino correctamente del carrito con id " + cid})
})



export default cartsRouter