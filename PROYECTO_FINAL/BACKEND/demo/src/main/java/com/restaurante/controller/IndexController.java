package com.restaurante.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
    @GetMapping({"/"})
    public String hola() {
        return "hola";
    }

    @GetMapping("/index")
    public String index() {
        return "pagina/index";
    }

    @GetMapping("/chelas")
    public String chelas() {
        return "pagina/chelas";
    }

    @GetMapping("/login")
    public String login() {
        return "pagina/login";
    }

    @GetMapping("/nosotros")
    public String nosotros() {
        return "pagina/nosotros";
    }

    @GetMapping("/piscos")
    public String piscos() {
        return "pagina/piscos";
    }

    @GetMapping("/productos")
    public String productos() {
        return "pagina/productos";
    }

    @GetMapping("/registro")
    public String registro() {
        return "pagina/registro";
    }

    @GetMapping("/rones")
    public String rones() {
        return "pagina/rones";
    }

    @GetMapping("/tequilas")
    public String tequilas() {
        return "pagina/tequilas";
    }

    @GetMapping("/vinos")
    public String vinos() {
        return "pagina/vinos";
    }

    @GetMapping("/vodckas")
    public String vodckas() {
        return "pagina/vodckas";
    }

        @GetMapping("/admin")
        public String admin() {
            return "admin/admin";
        }

        @GetMapping("/bartender")
        public String bartender() {
            return "bartender/bartender";
        }

        @GetMapping("/moso")
        public String moso() {
            return "moso/moso";
        }
    }
    

