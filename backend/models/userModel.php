<?php
require_once "../ddbb/DBConexion.php";

class User implements \JsonSerializable {
    private int $id;
    private string $name;
    private string $firstsurname;
    private ?string $secondsurname;
    private string $email;
    private string $password;
    private string $role;
    private ?string $biography;
    private ?string $profile_picture;

    public function __construct(array $data) {
        $this->id = $data["id"];
        $this->name = $data["name"];
        $this->firstsurname = $data["firstsurname"];
        $this->secondsurname = $data["secondsurname"] ?? null;
        $this->email = $data["email"];
        $this->password = $data["password"];
        $this->role = $data["role"];
        $this->biography = $data["biography"] ?? null;
        $this->profile_picture = $data["profile_picture"] ?? null;
    }

    public function jsonSerialize(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'firstsurname' => $this->firstsurname,
            'secondsurname' => $this->secondsurname,
            'email' => $this->email,
            'role' => $this->role,
            'biography' => $this->biography,
            'profile_picture' => $this->profile_picture
        ];
    }

    // Getters
    public function getId(): int {
        return $this->id;
    }

    public function getName(): string {
        return $this->name;
    }

    public function getFirstSurname(): string {
        return $this->firstsurname;
    }

    public function getSecondSurname(): ?string {
        return $this->secondsurname;
    }

    public function getEmail(): string {
        return $this->email;
    }

    public function getRole(): string {
        return $this->role;
    }

    public function getBiography(): ?string {
        return $this->biography;
    }

    public function getProfilePicture(): ?string {
        return $this->profile_picture;
    }

    public function isStudent(): bool {
        return $this->role === 'student';
    }

    public function isTeacher(): bool {
        return $this->role === 'teacher';
    }

    public static function getAllStudents(){
        $db = DBConexion::connection();
        $data = $db -> query("SELECT * FROM user WHERE role ='student'");
        $students = array();

        while ( $row = $data -> fetch_assoc()){
            $student = new User($row);
            $students[] = $student;
        }

        return $students;
    }
}