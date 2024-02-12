// 리액트 및 훅/라이브러리
import React, { useState, useEffect } from "react";

// HTTP 요청을 위한 Axios 라이브러리
import axios from "axios";

// API URL 설정
import API_URL from "/src/stores/apiURL";

const MainVoteList = ({ transferVoteId }) => {
  const [listsData, setListsData] = useState([]);

  // 메인페이지로 값 전송
  const openVoteDetailModal = (voteId) => {
    transferVoteId(voteId)
  };

  useEffect(() => {
    // API를 통해 투표 정보를 가져옵니다.
    axios.get(`${API_URL}/votes/ranks`).then((response) => {
      const sortedVotes = response.data.body;
      const lists = [
        {
          key: 0,
          subject: "좋아요 순",
          items: sortedVotes.sortByLikes.slice(0, 5).map((item) => ({
            ...item,
            title: item.title,
            likesCnt: item.likesCnt,
            totalChoiceCnt: item.totalChoiceCnt,
            voteId: item.voteId,
            memberId: item.memberId,
          })),
        },
        {
          key: 1,
          subject: "참여자 순",
          items: sortedVotes.sortByVoter.slice(0, 5).map((item) => ({
            ...item,
            title: item.title,
            likesCnt: item.likesCnt,
            totalChoiceCnt: item.totalChoiceCnt,
            voteId: item.voteId,
            memberId: item.memberId,
          })),
        },
        {
          key: 2,
          subject: "최신순",
          items: sortedVotes.sortByNew.slice(0, 5).map((item) => ({
            ...item,
            title: item.title,
            likesCnt: item.likesCnt,
            totalChoiceCnt: item.totalChoiceCnt,
            voteId: item.voteId,
            memberId: item.memberId,
          })),
        },
        {
          key: 3,
          subject: "박빙투표",
          items: sortedVotes.sortByClose.slice(0, 5).map((item) => ({
            ...item,
            title: item.title,
            likesCnt: item.likesCnt,
            totalChoiceCnt: item.totalChoiceCnt,
            voteId: item.voteId,
            memberId: item.memberId,
          })),
        },
      ];
      setListsData(lists);
    });
  }, []);

  return (
    <div className="flex flex-wrap justify-center">
      {listsData.map((data, index) => (
        <div
          key={data.key}
          className="max-w-sm mx-2 mt-20 p-4 shadow-md rounded-lg 
        border-t-2 border-teal-400 w-1/2"
        >
          <div className="flex justify-between pb-4">
            <p className="font-bold text-xl">{data.subject}</p>
          </div>
          <ul className="flex flex-col gap-2 pl-2">
            {data.items.map((item) => (
              <li key={item.voteId}>
                <button onClick={() => openVoteDetailModal(item.voteId)}>
                  <div className="flex flex-col">
                    <p className="font-bold text-lg">{item.title}</p>
                    <div className="flex flex-row gap-2">
                      <p>좋아요: {item.likesCnt}</p>
                      <p>참여: {item.totalChoiceCnt}</p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MainVoteList;
