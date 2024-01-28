package com.jaecheop.backgollajyu.vote.entity;

import com.jaecheop.backgollajyu.member.entity.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vote_id")
    private Long id;

    // FK
    @JoinColumn(name="member_id")
    @ManyToOne
    private Member member;

    private String title;

    private String description;

    private LocalDateTime createAt;

    @ManyToOne // Many votes can belong to one category
    @JoinColumn(name = "category_id")
    private Category category;
}
