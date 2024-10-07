export class Role {}

// -- Tabla de personas
// CREATE TABLE tb_personas (
//     id_persona VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
//     nombres VARCHAR(50) NOT NULL,
//     apellidos VARCHAR(50) NOT NULL,
//     correo VARCHAR(100) NULL,
//     id_tipo_persona VARCHAR(36),
//     id_tipo_documento VARCHAR(36),
//     id_sexo VARCHAR(36),
//     apellido_m VARCHAR(50),
//     fecha_nacimiento DATE,
//     id_direccion VARCHAR(36),
//     id_pais VARCHAR(36),
//     id_tipo_telefono VARCHAR(36),
//     FOREIGN KEY (id_tipo_persona) REFERENCES tb_tipo_persona(id_tipo_persona)x,
//     FOREIGN KEY (id_tipo_documento) REFERENCES tb_tipo_documento(id_tipo_documento)x,
//     FOREIGN KEY (id_sexo) REFERENCES tb_sexo(id_sexo)x,
//     FOREIGN KEY (id_direccion) REFERENCES tb_direccion(id_direccion)x,
//     FOREIGN KEY (id_pais) REFERENCES tb_pais(id_pais)x,
//     FOREIGN KEY (id_tipo_telefono) REFERENCES tb_tipo_telefono(id_tipo_telefono)
// );
