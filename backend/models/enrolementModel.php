<?php
require_once "../ddbb/DBConexion.php";

class Enrolment implements \JsonSerializable
{
    private int $id;
    private int $course_id;
    private int $user_id;
    private string $enrolment_datetime;
    private ?string $completed_datetime;

    public function __construct(array $data)
    {
        $this->id = $data["id"];
        $this->course_id = $data["course_id"];
        $this->user_id = $data["user_id"];
        $this->enrolment_datetime = $data["enrolment_datetime"];
        $this->completed_datetime = $data["completed_datetime"] ?? null;
    }

    public static function hasCourse(int $userId, int $courseId): bool
    {
        $db = DBConexion::connection();
        $stmt = $db->prepare("SELECT id FROM enrolment WHERE user_id = ? AND course_id = ?");
        $stmt->bind_param("ii", $userId, $courseId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->num_rows > 0;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'course_id' => $this->course_id,
            'user_id' => $this->user_id,
            'enrolment_datetime' => $this->enrolment_datetime,
            'completed_datetime' => $this->completed_datetime
        ];
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getCourseId(): int
    {
        return $this->course_id;
    }

    public function getUserId(): int
    {
        return $this->user_id;
    }

    public function getEnrolmentDate(): string
    {
        return $this->enrolment_datetime;
    }

    public function getCompletionDate(): ?string
    {
        return $this->completed_datetime;
    }
}
?>
