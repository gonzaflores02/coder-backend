import { Router } from "express"
import fs from 'fs';

const productsRouter = Router()
let products = JSON.parse(fs.readFileSync("./routes/products.json", "utf-8"));

export const getId = () => {
    return products.length + 1;
}

productsRouter.get("/", (req, res) => {
    const limit = req.query.limit;
    if(!isNaN(limit) && limit > 0){
        res.send(products.slice(0, limit))
    } else{
    res.send(products);
}
})

productsRouter.get("/:idProducto", (req, res) => {
    const {idProducto} = req.params;
    if(isNaN(idProducto)){
        res.status(400).send({"status" : "error", "mensaje" : "El id " + idProducto + " " + "No es un numero" })
    } else{
    const producto = products.find(item => item.id == idProducto)
    res.send(producto ? producto : {"status" : "error", "mensaje" : "No se encontro el producto con el id " + idProducto})
}
})

productsRouter.post("/", (req, res) => {
    const {title, description, code, price, status = true, stock, category, thumbnails = []} = req.body;

    if(!title || typeof title !== "string" || title.trim() === ""){
        return res.status(400).send({"status" : "error", "mensaje" : "Se requiere un titulo valido"})
    }

    if (products.some((item) => item.title.toLowerCase() === title.toLowerCase())) {
        return res.status(409).json({ "status": "error", "mensaje" : "El titulo del producto ya existe" });
    }

    if(!description || typeof description !== "string" || description.trim() === ""){
        return res.status(400).send({"status" : "error", "mensaje" : "Se requiere una descripcion valida"})
    }

    if(!code || typeof code !== "string" || code.trim() === ""){
        return res.status(400).send({"status" : "error", "mensaje" : "Se requiere un codigo valido"})
    }

    if (products.some((item) => item.code.toLowerCase() === code.toLowerCase())) {
        return res.status(409).json({ "status": "error", "mensaje" : "El codigo del producto ya existe" });
    }

    if(price == null || typeof price !== "number" || price <= 0){
        return res.status(400).send({"status" : "error", "mensaje" : "Se requiere un precio valido"})
    }

    if (typeof status !== "boolean") {
        return res.status(400).send({"status" : "error", "mensaje" : "El valor de 'status' debe ser un booleano"});
    }

    if((stock == null || typeof stock !== "number" || stock < 0)){
        return res.status(400).send({"status" : "error", "mensaje" : "Se requiere un stock valido"})
    }

    if(!category || typeof category !== "string" || category.trim() === ""){
        return res.status(400).send({"status" : "error", "mensaje" : "Se requiere una categoria valida"})
    }
    if (thumbnails && !Array.isArray(thumbnails)) {
        return res.status(400).send({"status" : "error", "mensaje" : "El campo 'thumbnails' debe ser un array"});
    }
    if (thumbnails && thumbnails.some(thumb => typeof thumb !== 'string')) {
        return res.status(400).send({"status" : "error", "mensaje" : "Cada elemento de 'thumbnails' debe ser una cadena de texto"});
    }

    const newProducto = {id:getId(), title, description, code, price, status, stock, category, thumbnails}

    products.push(newProducto)
    res.send({"status" : "ok", "mensaje" : "Se agrego correctamente el producto"})

})

productsRouter.put("/:idProducto", (req, res) => {
    const { idProducto } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    const producto = products.find(item => item.id == idProducto);

    if (!producto) {
        return res.status(404).send({
            status: "error",
            mensaje: `No se encontró el producto con el id ${idProducto}`
        });
    }

    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).send({ status: "error", mensaje: "Título inválido" });
        }
        if (
            title.toLowerCase() !== producto.title.toLowerCase() &&
            products.some((item) => item.title.toLowerCase() === title.toLowerCase())
        ) {
            return res.status(409).json({ status: "error", mensaje: "El título del producto ya existe" });
        }
        producto.title = title;
    }

    if (description !== undefined) {
        if (typeof description !== "string" || description.trim() === "") {
            return res.status(400).send({ status: "error", mensaje: "Descripción inválida" });
        }
        producto.description = description;
    }

    if (code !== undefined) {
        if (typeof code !== "string" || code.trim() === "") {
            return res.status(400).send({ status: "error", mensaje: "Código inválido" });
        }
        if (
            code.toLowerCase() !== producto.code.toLowerCase() &&
            products.some((item) => item.code.toLowerCase() === code.toLowerCase())
        ) {
            return res.status(409).json({ status: "error", mensaje: "El código del producto ya existe" });
        }
        producto.code = code;
    }

    if (price !== undefined) {
        if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
            return res.status(400).send({ status: "error", mensaje: "Precio inválido" });
        }
        producto.price = price;
    }

    if (status !== undefined) {
        if (typeof status !== "boolean") {
            return res.status(400).send({ status: "error", mensaje: "El status debe ser un booleano" });
        }
        producto.status = status;
    }

    if (stock !== undefined) {
        if (typeof stock !== "number" || !Number.isInteger(stock) || stock < 0) {
            return res.status(400).send({ status: "error", mensaje: "Stock inválido" });
        }
        producto.stock = stock;
    }

    if (category !== undefined) {
        if (typeof category !== "string" || category.trim() === "") {
            return res.status(400).send({ status: "error", mensaje: "Categoría inválida" });
        }
        producto.category = category;
    }

    if (thumbnails !== undefined) {
        if (!Array.isArray(thumbnails) || thumbnails.some(thumb => typeof thumb !== "string")) {
            return res.status(400).send({ status: "error", mensaje: "Thumbnails debe ser un array de strings" });
        }
        producto.thumbnails = thumbnails;
    }

    return res.send({
        status: "ok",
        mensaje: "Producto actualizado correctamente",
        producto
    });
});

productsRouter.delete("/:idProducto", (req, res) => {
    const {idProducto} = req.params
    const producto = products.find(item => item.id == idProducto)

    if(!producto){
        return res.status(400).send({"status": "error", "mensaje": "No se encontró el producto con el id " + idProducto})
    }

    products = products.filter(item => item.id != idProducto)
    res.send({"status" : "ok", "mensaje" : "El usuario se elimino correctamente"})
})


export default productsRouter