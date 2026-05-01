CREATE SCHEMA GYM;

CREATE TABLE GYM.Usuario
(
    id_usuario SERIAL PRIMARY KEY,
    correo     VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(100)        NOT NULL,
    rol        VARCHAR(20)         NOT NULL
);

CREATE TABLE GYM.Perfil
(
    id_perfil        SERIAL PRIMARY KEY,
    id_usuario       INT UNIQUE NOT NULL,
    nombre           VARCHAR(50),
    apellido1        VARCHAR(50),
    apellido2        VARCHAR(50),
    fecha_nacimiento DATE,
    altura           DOUBLE PRECISION,
    peso_inicial     DOUBLE PRECISION,
    foto_url         TEXT,
    FOREIGN KEY (id_usuario) REFERENCES GYM.Usuario (id_usuario) ON DELETE CASCADE
);

CREATE TABLE GYM.Gym
(
    id_gym      SERIAL PRIMARY KEY,
    nombre      VARCHAR(50),
    descripcion TEXT,
    logo_url    TEXT
);

CREATE TABLE GYM.Membresia
(
    id_membresia SERIAL PRIMARY KEY,
    id_usuario   INT         NOT NULL,
    id_gym       INT         NOT NULL,
    rol          VARCHAR(20) NOT NULL,
    UNIQUE (id_usuario, id_gym),
    FOREIGN KEY (id_usuario) REFERENCES GYM.Usuario (id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_gym) REFERENCES GYM.Gym (id_gym) ON DELETE CASCADE
);

CREATE TABLE GYM.Ejercicio
(
    id_ejercicio   SERIAL PRIMARY KEY,
    nombre         VARCHAR(100) UNIQUE,
    grupo_muscular VARCHAR(50),
    descripcion    TEXT,
    imagen_url     TEXT,
    video_url      TEXT
);

CREATE TABLE GYM.Medidas
(
    id          SERIAL PRIMARY KEY,
    id_usuario  INT NOT NULL,
    peso        DOUBLE PRECISION,
    biceps      DOUBLE PRECISION,
    antebrazo   DOUBLE PRECISION,
    pecho       DOUBLE PRECISION,
    cintura     DOUBLE PRECISION,
    abdomen     DOUBLE PRECISION,
    cadera      DOUBLE PRECISION,
    muslo       DOUBLE PRECISION,
    pantorrilla DOUBLE PRECISION,
    fecha       DATE,
    FOREIGN KEY (id_usuario) REFERENCES GYM.Usuario (id_usuario) ON DELETE CASCADE
);

CREATE TABLE GYM.Rutina
(
    id_rutina   SERIAL PRIMARY KEY,
    id_usuario  INT NOT NULL,
    nombre      VARCHAR(100),
    descripcion TEXT,
    activo      BOOLEAN DEFAULT FALSE,
    created_by  INT,
    FOREIGN KEY (id_usuario) REFERENCES GYM.Usuario (id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES GYM.Usuario (id_usuario)
);

CREATE TABLE GYM.Rutina_dia
(
    id_rutina_dia SERIAL PRIMARY KEY,
    id_rutina  INT NOT NULL,
    dia_numero INT,
    nombre     VARCHAR(50),
    UNIQUE (id_rutina, dia_numero),
    FOREIGN KEY (id_rutina) REFERENCES GYM.Rutina (id_rutina) ON DELETE CASCADE
);

CREATE TABLE GYM.Rutina_ejercicio
(
    id_rutina_ejercicio        SERIAL PRIMARY KEY,
    id_dia            INT NOT NULL,
    id_ejercicio      INT NOT NULL,
    sets              INT NOT NULL,
    reps              INT NOT NULL,
    descanso_segundos INT NOT NULL,
    notas             TEXT,
    FOREIGN KEY (id_dia) REFERENCES GYM.Rutina_dia (id_rutina_dia) ON DELETE CASCADE,
    FOREIGN KEY (id_ejercicio) REFERENCES GYM.Ejercicio (id_ejercicio) ON DELETE CASCADE
);