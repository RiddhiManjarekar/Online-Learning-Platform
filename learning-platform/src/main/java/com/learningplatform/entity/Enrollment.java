package com.learningplatform.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "enrollments")
@CompoundIndex(
        name = "learner_course_unique",
        def = "{'learnerId': 1, 'courseId': 1}",
        unique = true
)
public class Enrollment {

    @Id
    private String id;

    private String learnerId;

    private String courseId;

    private Instant enrolledAt;

    private List<String> completedLessonIds = new ArrayList<>();

    public Enrollment() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLearnerId() {
        return learnerId;
    }

    public void setLearnerId(String learnerId) {
        this.learnerId = learnerId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public Instant getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(Instant enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public List<String> getCompletedLessonIds() {
        return completedLessonIds;
    }

    public void setCompletedLessonIds(List<String> completedLessonIds) {
        this.completedLessonIds = completedLessonIds;
    }
}