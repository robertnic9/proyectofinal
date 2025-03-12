<?php
require_once "../ddbb/DBConexion.php";

class Course implements \JsonSerializable
{
    private int $id;
    private string $name;
    private string $description;
    private string $url_image;
    private int $teacher_id;

    public function __construct(array $data)
    {
        $this->id = $data["id"];
        $this->name = $data["name"];
        $this->description = $data["description"];
        $this->url_image = $data["url_image"];
        $this->teacher_id = $data["teacher_id"];
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'url_image' => $this->url_image,
            'teacher_id' => $this->teacher_id
        ];
    }

    // Getters
    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getUrlImage(): string
    {
        return $this->url_image;
    }

    public function getTeacherId(): int
    {
        return $this->teacher_id;
    }

    // Static methods for database operations
    public static function getAllCourses()
    {
        $db = DBConexion::connection();
        $data = $db->query("SELECT * FROM course ");
        $courses = array();

        while ($row = $data->fetch_assoc()) {
            $course = new Course($row);
            $courses[] = $course;
        }

        return $courses;
    }

    public static function getCourseById(int $id)
    {
        $db = DBConexion::connection();
        $stmt = $db->prepare("SELECT * FROM course WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            return new Course($row);
        }

        return null;
    }

    public static function isTeacher(int $teacherId, int $courseId): bool
    {
        $db = DBConexion::connection();
        $stmt = $db->prepare("SELECT * FROM course WHERE teacher_id = ? AND id = ?");
        $stmt->bind_param("ii", $teacherId, $courseId);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->num_rows > 0;
    }

}