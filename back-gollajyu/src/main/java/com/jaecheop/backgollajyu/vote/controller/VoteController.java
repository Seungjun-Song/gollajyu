package com.jaecheop.backgollajyu.vote.controller;

import com.jaecheop.backgollajyu.member.model.LoginResDto;
import com.jaecheop.backgollajyu.vote.entity.VoteItem;
import com.jaecheop.backgollajyu.vote.model.*;
import com.jaecheop.backgollajyu.vote.repository.VoteItemRepository;
import com.jaecheop.backgollajyu.vote.repository.VoteResultRepository;
import com.jaecheop.backgollajyu.vote.service.VoteService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/votes")
public class VoteController {

    private final VoteService voteService;

    @Value("${file.dir}")
    private String fileDir;
    private VoteResultRepository voteResultRepository;
    private VoteItemRepository voteItemRepository;

    // TODO: main GET들...

    /**
     * 투표 생성 - create
     *
     * @return
     */
    @PostMapping("")
    public ResponseEntity<ResponseMessage> addVote(VoteReqDto voteReqDto) {

        // 서비스단으로 넘겨서 로직 처리 -> ServiceResult(result, message, object-data)로 반환
        ServiceResult result = voteService.addVote(voteReqDto, fileDir);

        // 받아온 결과에 따라 에러 메세지 출력하거나 return 하거나
        if (!result.isResult()) {
            return ResponseEntity.ok().body(ResponseMessage.fail(result.getMessage()));
        }
        return ResponseEntity.ok().body(ResponseMessage.success());
    }

    /**
     * 메인에서 투표하기
     *
     * @param choiceReqDto
     * @return
     */
    @PostMapping("/choices")
    public ResponseEntity<ResponseMessage> choiceMain(@RequestBody ChoiceReqDto choiceReqDto) {

        ServiceResult result = voteService.choiceMain(choiceReqDto);

        if (!result.isResult()) {
            return ResponseEntity.ok().body(ResponseMessage.fail(result.getMessage()));
        }
        return ResponseEntity.ok().body(ResponseMessage.success());

    }

    /**
     * 투표 상세
     *
     * @param
     * @return
     */

    @GetMapping("/detail")
    public ResponseEntity<VoteDetailResDto> voteDetail(@ModelAttribute VoteDetailReqDto voteDetailReqDto) {
        System.out.println("voteDetailReqDto = " + voteDetailReqDto);
        ServiceResult result = voteService.voteDetail(voteDetailReqDto);
        if (!result.isResult()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>((VoteDetailResDto) result.getData(), HttpStatus.OK);
    }

    /**
     * top 5 - 좋아요, 최신, 참여자, 박빙
     *
     * @return
     */
    @GetMapping("/ranks")
    public ResponseEntity<ResponseMessage> voteRanking() {
        ServiceResult result = voteService.getVoteRanking();
        if (!result.isResult()) {
            return ResponseEntity.ok().body(ResponseMessage.fail(result.getMessage()));
        }

        return ResponseEntity.ok().body(ResponseMessage.success(result.getData()));

    }

    /**
     * main에서 투표 목록 리스트 조회 - category 별
     *
     * @param categoryId
     * @param session
     * @return
     */

    @GetMapping("")
    public ResponseEntity<ResponseMessage> voteListByCategory(@RequestParam(value = "categoryId") int categoryId, HttpSession session) {

        System.out.println("categoryId = " + categoryId);
        System.out.println("(LoginResDto)session.getAttribute(\"memberInfo\") = " + (LoginResDto) session.getAttribute("memberInfo"));
        LoginResDto sessionInfo = (LoginResDto) session.getAttribute("memberInfo");
        ServiceResult result = voteService.getVoteListByCategory(categoryId, sessionInfo);

        if (!result.isResult()) {
            return ResponseEntity.ok().body(ResponseMessage.fail(result.getMessage()));
        }

        return ResponseEntity.ok().body(ResponseMessage.success(result.getData()));
    }


    @PostMapping("/likes")
    public ResponseEntity<ResponseMessage> toggleLikes(@RequestBody LikesReqDto likesReqDto) {
        ServiceResult result = voteService.toggleLikes(likesReqDto);
        if (!result.isResult()) {
            return ResponseEntity.ok(ResponseMessage.fail(result.getMessage()));
        }
        return ResponseEntity.ok(ResponseMessage.success(result.getData()));
    }


    @GetMapping("/search")
    public ResponseEntity<ResponseMessage> searchVoteList(
            @RequestParam(name = "categoryId", defaultValue = "0") String categoryId
            , @RequestParam(name = "keyword", defaultValue = "") String keyword
            , HttpSession session) {
        SearchReqDto searchReqDto = SearchReqDto.builder()
                .categoryId(Integer.parseInt(categoryId))
                .keyword(keyword)
                .build();

        ServiceResult result = voteService.searchVoteList(searchReqDto, (LoginResDto) session.getAttribute("memberInfo"));

        if (!result.isResult()) {
            return ResponseEntity.ok().body(ResponseMessage.fail(result.getMessage()));
        }

        return ResponseEntity.ok().body(ResponseMessage.success(result.getData()));
    }


    @GetMapping("/ai")
    public ResponseEntity<Long> gollAi(@RequestBody GollAiReqDto gollAiReqDto) {

        Long gollaItem = 0L;

        Long memberId = gollAiReqDto.getMemberId();
        Long voteId = gollAiReqDto.getVoteId();
        Integer categoryId = gollAiReqDto.getCategoryId();

        Map<Long, Long> voteItemIdGrade = new HashMap<>();
        List<CategoryTagDto> myCategoryTagDtoList = voteService.generateStatistics(voteResultRepository.findAllByMemberIdAndCategoryId(memberId, categoryId), null);

        List<VoteItem> itemByVoteId = voteItemRepository.findAllByVoteId(voteId);

        for (VoteItem voteItem : itemByVoteId) {
            List<CategoryTagDto> itemCategoryTagDtoList =
                    voteService.generateStatistics(
                            voteResultRepository.findAllByVoteItemId(voteItem.getId()),
                            null);
            long sums = 0L;
            for (CategoryTagDto itemCategoryTagDto : itemCategoryTagDtoList) {
                for (CategoryTagDto myCategoryTagDto : myCategoryTagDtoList) {
                    if (itemCategoryTagDto.getTagId().equals(myCategoryTagDto.getTagId())) {
                        sums += itemCategoryTagDto.getCount() * myCategoryTagDto.getCount();
                    }
                }
            }

            voteItemIdGrade.put(voteItem.getId(), sums);
        }

        Long keyWithHighestValue = Collections.max(voteItemIdGrade.entrySet(), Map.Entry.comparingByValue()).getKey();


        gollaItem = keyWithHighestValue;


        return new ResponseEntity<>(gollaItem, HttpStatus.OK);
    }

}
