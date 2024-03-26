import { Router } from "express";
import pool from "../database.js";

const router = Router();

router.get('/agregar', (req, res) => {
    res.render('usuarios/agregar')
})

router.post('/agregar', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const usuario = {
            nombre,
            email,
            password
        }
        await pool.query("INSERT INTO usuarios SET ?", [usuario]);
        res.redirect('/listar')
    } catch (error) {
        res.status(500).json({message:error.message});
    }
})

router.get('/listar', async(req, res) => {
    try {
        const [resultado] = await pool.query('SELECT * FROM usuarios');
        res.render('usuarios/listar',{
            usuarios: resultado
        })
    } catch(error) {
        res.status(500).json({message:error.message});
    }
})

router.get('/editar/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const [usuario] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
        const usuarioEditar = usuario[0];
        res.render('usuarios/editar', {
            usuario: usuarioEditar
        })
    } catch(error){
        res.status(500).json({message:error.message})
    }
})

router.post('/editar/:id', async (req, res) => {
    try {
        const { nombre, email } = req.body;
        const { id } = req.params;
        const usuarioEditar = { nombre, email }
        await pool.query("UPDATE usuarios SET ? WHERE id = ?", [usuarioEditar, id]);
        res.redirect('/listar')
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

router.get('/eliminar/:id', async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM usuarios WHERE id = ?", [id])
        res.redirect('/listar')
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

export default router;