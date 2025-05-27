-- Crear la base de datos si no existe 
CREATE DATABASE IF NOT EXISTS onlineEducation;
USE onlineEducation;

-- contraseña user es 123456

-- Tabla de usuarios (unificando estudiantes y profesores)
CREATE TABLE user (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(40) NOT NULL,
    firstsurname VARCHAR(40) NOT NULL,
    secondsurname VARCHAR(40) DEFAULT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher') NOT NULL,
    biography TEXT,
    profile_picture VARCHAR(255)
);

-- Tabla de cursos
CREATE TABLE course (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    url_image VARCHAR(255) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT 1,
    teacher_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_course_teacher FOREIGN KEY (teacher_id)
        REFERENCES user(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla de módulos
CREATE TABLE module (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    course_id INT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    number INT UNSIGNED NOT NULL CHECK (number > 0),
    CONSTRAINT fk_module_course FOREIGN KEY (course_id) 
        REFERENCES course(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de lecciones
CREATE TABLE lesson (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    module_id INT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    number INT UNSIGNED NOT NULL CHECK (number > 0),
    course_order INT UNSIGNED NOT NULL DEFAULT 1,
    video_url VARCHAR(250) NOT NULL,
    lesson_details VARCHAR(255) NOT NULL,
    CONSTRAINT fk_lesson_module FOREIGN KEY (module_id) 
        REFERENCES module(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de cuestionarios
CREATE TABLE quiz (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    course_id INT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    number INT UNSIGNED NOT NULL CHECK (number > 0),
    course_order INT UNSIGNED NOT NULL DEFAULT 1,
    min_pass_score TINYINT UNSIGNED NOT NULL CHECK (min_pass_score > 0 AND min_pass_score <= 100),
    is_pass_required BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_quiz_course FOREIGN KEY (course_id) 
        REFERENCES course(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de preguntas de cuestionario
CREATE TABLE quiz_question (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT UNSIGNED NOT NULL,
    question_title VARCHAR(255) NOT NULL,
    CONSTRAINT fk_question_quiz FOREIGN KEY (quiz_id) 
        REFERENCES quiz(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de respuestas de cuestionario
CREATE TABLE quiz_answer (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    question_id INT UNSIGNED NOT NULL,
    answer_text VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) 
        REFERENCES quiz_question(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de inscripciones
CREATE TABLE enrolment (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    course_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    enrolment_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_datetime DATETIME NULL,
    CONSTRAINT fk_enrolment_course FOREIGN KEY (course_id) 
        REFERENCES course(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_enrolment_user FOREIGN KEY (user_id) 
        REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla para cursos favoritos
CREATE TABLE user_favorite_course (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    course_id INT UNSIGNED NOT NULL,
    added_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_favorite_user FOREIGN KEY (user_id) 
        REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_favorite_course FOREIGN KEY (course_id) 
        REFERENCES course(id) ON DELETE CASCADE ON UPDATE CASCADE,
    -- Asegurar que un usuario no pueda marcar el mismo curso como favorito más de una vez
    CONSTRAINT uq_user_course UNIQUE (user_id, course_id)
);

-- Tabla de intentos de cuestionario
CREATE TABLE user_quiz_attempt (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    quiz_id INT UNSIGNED NOT NULL,
    attempt_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    score_achieved TINYINT UNSIGNED NOT NULL CHECK (score_achieved >= 0 AND score_achieved <= 100),
    CONSTRAINT fk_attempt_user FOREIGN KEY (user_id) 
        REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_attempt_quiz FOREIGN KEY (quiz_id) 
        REFERENCES quiz(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de seguimiento de lecciones
CREATE TABLE user_lesson (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    lesson_id INT UNSIGNED NOT NULL,
    completed_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_lesson_user FOREIGN KEY (user_id) 
        REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_user_lesson_lesson FOREIGN KEY (lesson_id) 
        REFERENCES lesson(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Inserts para usuarios (2 profesores y 2 alumnos)
-- La contraseña '12345678' hasheada con bcrypt
INSERT INTO user (name, firstsurname, secondsurname, email, password, role) VALUES
-- Profesores
('María', 'García', 'López', 'maria.garcia@example.com', '$2y$10$Iyi0qz1CGC8Vxgs08n0yWuIDwegrw5VSixJ9ybzgZ7hPo5yCsneDW', 'teacher'),
('Juan', 'Rodríguez', 'Martínez', 'juan.rodriguez@example.com', '$2y$10$Iyi0qz1CGC8Vxgs08n0yWuIDwegrw5VSixJ9ybzgZ7hPo5yCsneDW', 'teacher'),
-- Alumnos
('Ana', 'Sánchez', 'Pérez', 'ana.sanchez@example.com', '$2y$10$Iyi0qz1CGC8Vxgs08n0yWuIDwegrw5VSixJ9ybzgZ7hPo5yCsneDW', 'student'),
('Carlos', 'Martín', 'Gómez', 'carlos.martin@example.com', '$2y$10$Iyi0qz1CGC8Vxgs08n0yWuIDwegrw5VSixJ9ybzgZ7hPo5yCsneDW', 'student');

-- Inserts para cursos (6 cursos, solo 3 disponibles)
INSERT INTO course (name, description, price, url_image, available, teacher_id) VALUES
-- Cursos disponibles
('Programación en Python', 'Aprende a programar en Python desde cero hasta un nivel avanzado', 49.99, '/media/python.jpg', 1, 1),
('Desarrollo Web con React', 'Curso completo para crear aplicaciones web modernas con React', 59.99, '/media/react.png', 1, 1),
('Introducción a la Inteligencia Artificial', 'Fundamentos de IA y machine learning para principiantes', 69.99, '/media/ia.webp', 1, 2),
-- Cursos no disponibles
('Diseño UX/UI', 'Aprende a diseñar interfaces de usuario efectivas y atractivas', 54.99, '/media/ui.webp', 0, 2),
('Marketing Digital', 'Estrategias y técnicas para promocionar negocios en línea', 39.99, '/media/marketing.png', 0, 1),
('Data Science con R', 'Análisis de datos y visualización usando el lenguaje R', 64.99, '/media/data.webp', 0, 2);

-- Inserts para módulos (2 módulos por cada curso disponible)
INSERT INTO module (course_id, name, number) VALUES
-- Módulos para Programación en Python (course_id = 1)
(1, 'Fundamentos de Python', 1),
(1, 'Programación Orientada a Objetos', 2),
-- Módulos para Desarrollo Web con React (course_id = 2)
(2, 'Introducción a React', 1),
(2, 'Componentes y Estado', 2),
-- Módulos para Introducción a la Inteligencia Artificial (course_id = 3)
(3, 'Conceptos Básicos de IA', 1),
(3, 'Algoritmos de Machine Learning', 2);

-- Inserts para lecciones (3 lecciones por cada módulo)
INSERT INTO lesson (module_id, name, number, course_order, video_url, lesson_details) VALUES
-- Lecciones para Fundamentos de Python (module_id = 1)
(1, 'Instalación y configuración del entorno', 1, 1, 'https://example.com/videos/python_setup.mp4', 'En esta lección aprenderás a instalar Python y configurar tu entorno de desarrollo'),
(1, 'Variables y tipos de datos', 2, 2, 'https://example.com/videos/python_variables.mp4', 'Conoce los diferentes tipos de datos en Python y cómo trabajar con variables'),
(1, 'Estructuras de control de flujo', 3, 3, 'https://example.com/videos/python_control_flow.mp4', 'Aprende a usar condicionales y bucles para controlar el flujo de tu programa'),

-- Lecciones para Programación Orientada a Objetos (module_id = 2)
(2, 'Clases y objetos', 1, 4, 'https://example.com/videos/python_classes.mp4', 'Introducción a la programación orientada a objetos con clases en Python'),
(2, 'Herencia y polimorfismo', 2, 5, 'https://example.com/videos/python_inheritance.mp4', 'Aprende conceptos avanzados de POO como la herencia y el polimorfismo'),
(2, 'Métodos especiales y decoradores', 3, 6, 'https://example.com/videos/python_special_methods.mp4', 'Descubre los métodos mágicos y el uso de decoradores en Python'),

-- Lecciones para Introducción a React (module_id = 3)
(3, '¿Qué es React?', 1, 1, 'https://example.com/videos/react_intro.mp4', 'Introducción a React y sus ventajas sobre otras bibliotecas'),
(3, 'Configuración del entorno', 2, 2, 'https://example.com/videos/react_setup.mp4', 'Aprende a configurar un proyecto React con Create React App'),
(3, 'Tu primer componente', 3, 3, 'https://example.com/videos/react_first_component.mp4', 'Crea tu primer componente React y entiende su estructura básica'),

-- Lecciones para Componentes y Estado (module_id = 4)
(4, 'Props y estado', 1, 4, 'https://example.com/videos/react_props_state.mp4', 'Aprende a trabajar con propiedades y estado en componentes React'),
(4, 'Ciclo de vida de componentes', 2, 5, 'https://example.com/videos/react_lifecycle.mp4', 'Entiende los métodos del ciclo de vida de un componente React'),
(4, 'Hooks básicos', 3, 6, 'https://example.com/videos/react_hooks.mp4', 'Introducción a los hooks useState y useEffect'),

-- Lecciones para Conceptos Básicos de IA (module_id = 5)
(5, '¿Qué es la Inteligencia Artificial?', 1, 1, 'https://example.com/videos/ai_intro.mp4', 'Definición y conceptos básicos de la Inteligencia Artificial'),
(5, 'Historia y evolución de la IA', 2, 2, 'https://example.com/videos/ai_history.mp4', 'Recorrido por la historia y los hitos más importantes de la IA'),
(5, 'Aplicaciones actuales de la IA', 3, 3, 'https://example.com/videos/ai_applications.mp4', 'Descubre cómo se aplica la IA en diferentes campos hoy en día'),

-- Lecciones para Algoritmos de Machine Learning (module_id = 6)
(6, 'Introducción al Machine Learning', 1, 4, 'https://example.com/videos/ml_intro.mp4', 'Fundamentos del aprendizaje automático y tipos de algoritmos'),
(6, 'Regresión lineal', 2, 5, 'https://example.com/videos/ml_linear_regression.mp4', 'Aprende a implementar y entrenar un modelo de regresión lineal'),
(6, 'Árboles de decisión', 3, 6, 'https://example.com/videos/ml_decision_trees.mp4', 'Comprende cómo funcionan los árboles de decisión y su implementación');

-- Inserts para cuestionarios
INSERT INTO quiz (course_id, name, number, course_order, min_pass_score, is_pass_required) VALUES
-- Cuestionarios para Programación en Python (course_id = 1)
(1, 'Evaluación de Fundamentos', 1, 7, 70, TRUE),
(1, 'Evaluación de POO', 2, 14, 70, TRUE),
-- Cuestionarios para Desarrollo Web con React (course_id = 2)
(2, 'Test de React Básico', 1, 7, 60, FALSE),
(2, 'Test de Componentes Avanzados', 2, 14, 75, TRUE),
-- Cuestionarios para Introducción a la Inteligencia Artificial (course_id = 3)
(3, 'Evaluación de Conceptos', 1, 7, 65, FALSE),
(3, 'Test de Algoritmos', 2, 14, 70, TRUE);

-- Inserts para preguntas de cuestionario
INSERT INTO quiz_question (quiz_id, question_title) VALUES
-- Preguntas para Evaluación de Fundamentos (quiz_id = 1)
(1, '¿Qué tipo de dato se utiliza para almacenar texto en Python?'),
(1, '¿Cuál de las siguientes es una estructura de control de flujo?'),
(1, '¿Cómo se define una función en Python?'),
-- Preguntas para Evaluación de POO (quiz_id = 2)
(2, '¿Qué método se ejecuta automáticamente al crear una instancia de clase?'),
(2, '¿Qué es la herencia múltiple?'),
(2, '¿Qué es un método de clase?'),
-- Preguntas para Test de React Básico (quiz_id = 3)
(3, '¿Qué es JSX?'),
(3, '¿Cómo se renderiza un componente React?'),
(3, '¿Qué herramienta se utiliza comúnmente para crear proyectos React?'),
-- Preguntas para Test de Componentes Avanzados (quiz_id = 4)
(4, '¿Qué son los props en React?'),
(4, '¿Cuál es la diferencia entre estado y props?'),
(4, '¿Para qué se utiliza useEffect?'),
-- Preguntas para Evaluación de Conceptos (quiz_id = 5)
(5, '¿Qué es la Inteligencia Artificial?'),
(5, '¿Cuál fue el primer lenguaje de programación para IA?'),
(5, '¿Qué es un agente inteligente?'),
-- Preguntas para Test de Algoritmos (quiz_id = 6)
(6, '¿Qué es el aprendizaje supervisado?'),
(6, '¿Qué mide el error cuadrático medio?'),
(6, '¿Qué es el sobreajuste (overfitting)?');

-- Inserts para respuestas de cuestionario
INSERT INTO quiz_answer (question_id, answer_text, is_correct) VALUES
-- Respuestas para la pregunta 1
(1, 'String', TRUE),
(1, 'Integer', FALSE),
(1, 'Float', FALSE),
(1, 'Boolean', FALSE),
-- Respuestas para la pregunta 2
(2, 'if-else', TRUE),
(2, 'class', FALSE),
(2, 'def', FALSE),
(2, 'import', FALSE),
-- Respuestas para la pregunta 3
(3, 'def nombre_funcion():', TRUE),
(3, 'function nombre_funcion():', FALSE),
(3, 'create nombre_funcion():', FALSE),
(3, 'func nombre_funcion():', FALSE),
-- Y así sucesivamente para las demás preguntas...
-- Respuestas abreviadas para las preguntas restantes
(4, '__init__', TRUE),
(4, '__main__', FALSE),
(5, 'Capacidad de una clase de heredar de múltiples clases padre', TRUE),
(5, 'Capacidad de una clase de tener múltiples instancias', FALSE),
(6, 'Un método que pertenece a la clase, no a la instancia', TRUE),
(6, 'Un método que solo puede ser llamado por el constructor', FALSE),
(7, 'Una extensión de JavaScript que permite HTML en JavaScript', TRUE),
(7, 'Un nuevo lenguaje de programación', FALSE),
(8, 'ReactDOM.render()', TRUE),
(8, 'React.show()', FALSE),
(9, 'Create React App', TRUE),
(9, 'React Builder', FALSE),
(10, 'Valores que se pasan de un componente padre a un hijo', TRUE),
(10, 'Variables locales dentro de un componente', FALSE),
(11, 'Props son inmutables, estado puede cambiar', TRUE),
(11, 'No hay diferencia, son sinónimos', FALSE),
(12, 'Para ejecutar efectos secundarios en componentes funcionales', TRUE),
(12, 'Para crear nuevos componentes', FALSE),
(13, 'Capacidad de las máquinas de imitar comportamiento humano inteligente', TRUE),
(13, 'Un software específico para robots', FALSE),
(14, 'LISP', TRUE),
(14, 'Python', FALSE),
(15, 'Un sistema que percibe su entorno y toma acciones para lograr objetivos', TRUE),
(15, 'Un robot humanoide', FALSE),
(16, 'Aprendizaje con datos etiquetados', TRUE),
(16, 'Aprendizaje sin intervención humana', FALSE),
(17, 'La precisión de un modelo de regresión', TRUE),
(17, 'La velocidad de entrenamiento', FALSE),
(18, 'Cuando un modelo aprende demasiado de los datos de entrenamiento', TRUE),
(18, 'Cuando un modelo es demasiado simple', FALSE);

-- Inserts para inscripciones (los alumnos se inscriben en los cursos disponibles)
INSERT INTO enrolment (course_id, user_id, enrolment_datetime) VALUES
-- Ana (user_id = 3) se inscribe en los tres cursos disponibles
(1, 3, '2025-01-15 10:30:00'),
(2, 3, '2025-01-20 14:45:00'),
(3, 3, '2025-02-01 09:15:00'),
-- Carlos (user_id = 4) se inscribe en dos cursos disponibles
(1, 4, '2025-01-17 16:20:00'),
(3, 4, '2025-02-03 11:10:00');

-- Inserts para favoritos (cada alumno marca algunos cursos como favoritos)
INSERT INTO user_favorite_course (user_id, course_id, added_datetime) VALUES
-- Ana marca como favoritos 2 cursos
(3, 1, '2025-01-16 08:30:00'),
(3, 3, '2025-02-02 10:15:00'),
-- Carlos marca como favorito 1 curso
(4, 1, '2025-01-18 17:45:00');

-- Inserts para intentos de cuestionario (los alumnos han realizado algunos cuestionarios)
INSERT INTO user_quiz_attempt (user_id, quiz_id, attempt_datetime, score_achieved) VALUES
-- Ana ha hecho 2 cuestionarios
(3, 1, '2025-01-25 11:30:00', 85),
(3, 3, '2025-02-10 14:20:00', 75),
-- Carlos ha hecho 1 cuestionario
(4, 1, '2025-01-30 16:45:00', 90);

-- NO se insertan registros en user_lesson ya que especificaste que los alumnos todavía no han estudiado
UPDATE user
SET profile_picture = 
    CASE 
        WHEN id = 1 THEN '/media/maria.jpeg'
        WHEN id = 2 THEN '/media/juan.jpg'
    END
WHERE role = 'teacher' AND id IN (1, 2);
UPDATE user SET	profile_picture = '/media/sinfoto.webp' where role = 'student';