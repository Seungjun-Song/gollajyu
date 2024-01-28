package com.jaecheop.backgollajyu.Info.controller;


import com.jaecheop.backgollajyu.Info.model.StatisticsSearchReqDto;
import com.jaecheop.backgollajyu.Info.service.InfoService;
import com.jaecheop.backgollajyu.vote.repository.VoteResultRepository;
import com.jaecheop.backgollajyu.vote.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/statistics")
public class InfoController {

    private final VoteService voteService;

    private final VoteResultRepository voteResultRepository;

    private final InfoService infoService;

    @GetMapping("")
    public Map<String, Long> resultStatistics(@RequestBody(required = false) StatisticsSearchReqDto statisticsSearchReqDto) {
        System.out.println("statisticsSearchReqDto = " + statisticsSearchReqDto.getCategoryId());
        if (statisticsSearchReqDto.getCategoryId() == null) {
            return voteService.generateStatistics(voteResultRepository.findByAll(), statisticsSearchReqDto);
        } else {
            return voteService.generateStatistics(voteResultRepository.findByCategoryId(statisticsSearchReqDto.getCategoryId()), statisticsSearchReqDto);
        }
    }
}
