package com.learningplatform.repository;

import com.learningplatform.entity.Lesson;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LessonRepository extends MongoRepository<Lesson, String> {

    List<Lesson> findByCourseIdOrderByOrderIndexAsc(String courseId);

    boolean existsByCourseId(String courseId);

    boolean existsByCourseIdAndOrderIndex(
            String courseId,
            int orderIndex
    );

    boolean existsByCourseIdAndOrderIndexAndIdNot(
            String courseId,
            int orderIndex,
            String id
    );

    long countByCourseId(String courseId);

    long deleteByCourseId(String courseId);
}