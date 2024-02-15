// 리액트 및 훅/라이브러리
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// HTTP 요청을 위한 Axios 라이브러리
import axios from "axios";

// API URL 설정
import API_URL from "/src/stores/apiURL";

// 반응형 웹 디자인을 위한 유틸리티 함수
import { useResponsiveQueries } from "/src/stores/responsiveUtils";

// 커스텀 스토어를 이용한 상태 관리
import useAuthStore from "/src/stores/userState";

// 소비성향 데이터 불러오기
import sobiTIData from "/src/stores/testResultData.js";

// 소비성향 조사 결과 컴포넌트
import TestResultHeader from "../TestResultHeader";

// 이미지 가져오기
import questionMarkImg from "/assets/images/question_mark_img.png";

const MyProfile = () => {
  // ------------------ 반응형 웹페이지 구현 ------------------
  const { isXLarge, isLarge, isMedium, isSmall } = useResponsiveQueries();

  //  ----------- 상세 설명 토글하기 위한 상태 -----------
  const [showInfoDescription, setShowInfoDescription] = useState(false);
  const [showTestDescription, setTestShowDescription] = useState(false);

  // ----------- 상태 토글 함수 -----------
  const toggleInfoDescription = () => {
    setShowInfoDescription(!showInfoDescription);
  };
  const toggleTestDescription = () => {
    setTestShowDescription(!showTestDescription);
  };

  // ----------- 버튼 hover -----------
  const [buttonHovered, setButtonHovered] = useState(false);
  const [testButtonHovered, setTestButtonHovered] = useState(false);

  // ----------- state 정의 -----------
  const [result, setResult] = useState(1);
  const [matchingData, setMatchingData] = useState({});

  // ----------- result가 변경될 때마다 실행되는 함수 -----------
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    window.scrollTo({ top: 0 }); // 페이지 로드되면 최상단으로 가기
    setResult(user.typeId);
    setMatchingData(sobiTIData.find((data) => data.id === user.typeId));
  }, []);

  const [isEditMode, setIsEditMode] = useState(false);
  const [changedNickname, setChangedNickname] = useState(user.nickname);
  const updateNickname = useAuthStore((state) => state.updateNickname);
  const handleEditToggle = () => {
    if (isEditMode) {
      const data = {
        ...user,
        nickname: changedNickname,
      };
      axios.put(API_URL + "/members", data).then((res) => {
        // console.log("닉네임 변경");
        updateNickname(changedNickname);
      });
    }
    setIsEditMode(!isEditMode);
  };

  // --------------------------------- css 시작 ---------------------------------

  // ----------- 컨텐츠 컨테이너 스타일 -----------
  const containerStyle = {
    // 디자인
    marginBottom: isXLarge
      ? "50px"
      : isLarge
      ? "45px"
      : isMedium
      ? "40px"
      : "35px",
  };

  // ----------- flex 컨테이너 스타일 -----------
  const flexContainerStyle = {
    // 컨텐츠 정렬
    display: "flex",
    alignItems: "center",
  };

  // ----------- 제목 컨테이너 스타일 -----------
  const titleContainerStyle = {
    // 상속
    ...flexContainerStyle,

    // 디자인
    marginBottom: isXLarge || isLarge ? "20px" : "15px",
    height: isXLarge ? "45px" : isLarge ? "40px" : isMedium ? "35px" : "30px",
  };

  // ----------- 제목 스타일 -----------
  const titleStyle = {
    // 디자인
    marginTop: "5px",
    marginRight: "5px",
  };

  // ----------- 물음표 스타일 -----------
  const questionMarkStyle = {
    // 디자인
    margin: "0 5px",
    width: "16px",
    height: "16px",
  };

  // ----------- 설명 스타일 -----------
  const descriptionStyle = {
    // 디자인
    padding: "2px 5px 0",
    borderRadius: "3px",
    backgroundColor: "#6B6B6B",

    // 글자
    fontSize: "13px",
    color: "#FFFFFF",
  };

  // ----------- 컨텐츠 컨테이너 스타일 -----------
  const contentContainerStyle = {
    // 디자인
    padding: isXLarge ? "40px" : isLarge ? "35px" : isMedium ? "30px" : "25px",
    borderRadius: isXLarge
      ? "50px"
      : isLarge
      ? "40px"
      : isMedium
      ? "30px"
      : "20px",
    background: "#FFFFFF",
  };

  // ----------- 프로필 이미지 스타일 -----------
  const profileImageStyle = {
    // 디자인
    marginRight: "40px",
    width: isXLarge ? "100px" : isLarge ? "90px" : isMedium ? "80px" : "70px",
    height: isXLarge ? "100px" : isLarge ? "90px" : isMedium ? "80px" : "70px",
    borderRadius: "50%",
  };

  // ----------- 프로필 글자 스타일 -----------
  const profileTextStyle = {
    // 디자인
    marginTop: "10px",
  };

  // ----------- 구분선 스타일 -----------
  const barStyle = {
    // 디자인
    margin: isXLarge
      ? "30px 0"
      : isLarge
      ? "25px 0"
      : isMedium
      ? "20px 0"
      : "15px 0",
    width: "100%",
    height: "3px",
    backgroundColor: "#F0F0F0",
  };

  // ----------- 정보 컨테이너 스타일 -----------
  const infoContainerStyle = {
    // 상속
    ...flexContainerStyle,

    // 컨텐츠 정렬
    flexDirection: isXLarge || isLarge ? "row" : "column",
  };

  // ----------- 정보 아이템 스타일 -----------
  const infoItemStyle = {
    // 상속
    ...flexContainerStyle,

    // 디자인
    margin: isXLarge || isLarge ? "10px 0" : "5px 0",
    padding: isXLarge
      ? "10px 20px"
      : isLarge
      ? "8px 18px"
      : isMedium
      ? "6px 16px"
      : "4px 14px",
    width: isXLarge || isLarge ? "50%" : "100%", // (반응형) 큰 화면에서 아이템이 한 줄에 두 개씩 나타나게 함
    height: isXLarge ? "60px" : isLarge ? "52px" : isMedium ? "44px" : "36px",
    backgroundColor: "#F0F0F0",

    // 컨텐츠 정렬
    justifyContent: "space-between",
  };

  // ----------- 왼쪽 아이템 스타일 -----------
  const infoItemLeftStyle = {
    // 상속
    ...infoItemStyle,

    // 디자인
    marginRight: isXLarge ? "16px" : isLarge ? "12px" : "0px",
  };

  // ----------- 오른쪽 아이템 스타일 -----------
  const infoItemRightStyle = {
    // 상속
    ...infoItemStyle,

    // 디자인
    marginLeft: isXLarge ? "16px" : isLarge ? "12px" : "0px",
  };

  // ----------- 정보 데이터 스타일 -----------
  const infoDataStyle = {
    // 디자인
    marginTop: "3px",

    // 글자
    color: "#4A4A4A",
  };

  // ----------- 쇠비성향 컨텐츠 컨테이너 스타일 -----------
  const testContainerStyle = {
    // 상속
    ...contentContainerStyle,
    ...flexContainerStyle,

    // 컨텐츠 정렬
    flexDirection: "column",
  };

  // --------------------------------- css 끝 ---------------------------------

  return (
    <>
      {/* ------------- 기본정보 ------------- */}
      <div style={containerStyle}>
        <div style={titleContainerStyle}>
          <span style={titleStyle} className="fontsize-lg">
            # 기본정보
          </span>
          <img
            src={questionMarkImg}
            style={questionMarkStyle}
            alt="물음표"
            className="cursor-pointer rounded-full"
            onClick={toggleInfoDescription}
            onMouseOver={() => setShowInfoDescription(true)}
            onMouseOut={() => setShowInfoDescription(false)}
          />
          <p
            style={{
              ...descriptionStyle,
              visibility: showInfoDescription ? "visible" : "hidden",
            }}
          >
            회원가입 시 입력한 정보
          </p>
        </div>
        <div style={contentContainerStyle}>
          <div style={flexContainerStyle}>
            <img
              src={
                // user.profileImgUrl이 숫자면 -> 소비성향테스트 결과 번호 -> 해당 번호의 png 파일을 src로 지정
                !isNaN(user.profileImgUrl)
                  ? `/assets/images/sobiTest/${user.profileImgUrl}.png`
                  : user.profileImgUrl
              }
              alt="프로필 이미지"
              style={profileImageStyle}
            />
            <div>
              {/* {isEditMode ? (
                <div className="flex">
                  <input
                    type="text"
                    value={changedNickname}
                    onChange={(e) => {
                      if (e.target.value.length > 6) {
                        window.alert("닉네임은 6글자까지만 가능해요");
                        setChangedNickname(e.target.value.slice(0, 6));
                      } else {
                        setChangedNickname(e.target.value);
                      }
                    }}
                  />
                  <button
                    className="mx-4 px-3 py-1 border-4 border-zinc-300 rounded-md fontsize-sm text-zinc-500 bg-white hover:bg-zinc-200"
                    onClick={handleEditToggle}
                  >
                    수정완료
                  </button>
                </div>
              ) : (
                <div className="flex">
                  <div style={profileTextStyle} className="fontsize-lg">
                    {user.nickname}
                  </div>
                  <button
                    className="relative mx-4 mt-2 px-3 py-1 h-10 border-4 border-zinc-300 rounded-md fontsize-sm text-zinc-500 bg-white hover:bg-zinc-200"
                    onMouseOver={() => setButtonHovered(true)}
                    onMouseOut={() => setButtonHovered(false)}
                    onClick={handleEditToggle}
                  >
                    {buttonHovered && (
                      <p className="absolute left-1 -top-6 text-amber-400">
                        100p가 사용됩니다
                      </p>
                    )}
                    닉네임 수정하기
                  </button>
                </div>
              )} */}

              <div style={profileTextStyle} className="fontsize-md">
                {user.email}
              </div>
            </div>
          </div>
          <div style={barStyle}></div>
          <div style={infoContainerStyle}>
            <div style={infoItemLeftStyle}>
              <div className="fontsize-md">생년월일</div>
              <div style={infoDataStyle} className="fontsize-sm">
                {`${user.birthday.year}.${String(user.birthday.month).padStart(
                  2,
                  "0"
                )}.${String(user.birthday.day).padStart(2, "0")}`}
              </div>
            </div>
            <div style={infoItemRightStyle}>
              <div className="fontsize-md">성별</div>
              <div style={infoDataStyle} className="fontsize-sm">
                {user.gender === "MALE" ? "남성" : "여성"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------- 소비성향 ------------- */}
      <div style={containerStyle}>
        <div style={titleContainerStyle}>
          <span style={titleStyle} className="fontsize-lg">
            # 소비성향
          </span>
          <img
            src={questionMarkImg}
            style={questionMarkStyle}
            alt="물음표"
            className="cursor-pointer rounded-full"
            onClick={toggleTestDescription}
            onMouseOver={() => setTestShowDescription(true)}
            onMouseOut={() => setTestShowDescription(false)}
          />
          <p
            style={{
              ...descriptionStyle,
              visibility: showTestDescription ? "visible" : "hidden",
            }}
          >
            소비성향 테스트 결과
          </p>
        </div>
        <div style={testContainerStyle}>
          <TestResultHeader data={matchingData} result={result} />
          <NavLink
            to="/TestResultPage"
            end
            className="w-1/3 sm:w-2/5 md:w-2/5 p-5 rounded-full bg-amber-300 hover:bg-amber-400 text-center fontsize-sm"
            onMouseOver={() => setTestButtonHovered(true)}
            onMouseOut={() => setTestButtonHovered(false)}
          >
            자세히 알아보기
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
