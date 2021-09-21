import React, { useState } from 'react';
import styles from './Register.module.css';
import AWS from "aws-sdk";
import axios from "axios";

const Register = (props) => {

  const artCount = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  const tags = ['#현대미술', '#일러스트레이션', '#회화'] //더미카테고리
  
  const [title, setTitle] = useState(''); //전시명
  const [startDate, setStartDate] = useState(''); //전시시작일
  const [endDate, setEndDate] = useState(''); //전시마감일
  const [type, setType] = useState('') //전시타입
  const [isClicked, setClicked] = useState([]); //전시장르
  const [arts, setArts] = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}]) //9개 작품 배열

  const handleTitle = (event) => {
    setTitle(event.target.value);
  }
  const handleStartDate = (event) => {
    setStartDate(event.target.value);
  }
  const handleEndDate = (event) => {
    setEndDate(event.target.value);
  }

  const tagHandle = (tag) => {
    if (isClicked.includes(tag)) {
      setClicked(isClicked.filter((el) => !(el === tag)));
    } else {
      setClicked(isClicked.concat(tag));
    }
  };

  const handleType = (event) => {
    setType(event.target.value)
  }
  
  const handleArtTitle = (el, e) => {
    let newArts = [...arts.slice(0, Number(el-1)), {...arts[Number(el-1)]}, ...arts.slice(Number(el), 9)]
    newArts[Number(el-1)].title = e.target.value;
    setArts(newArts);
  }

  const handleArtContent = (el, e) => {
    let newArts = [...arts.slice(0, Number(el-1)), {...arts[Number(el-1)]}, ...arts.slice(Number(el), 9)]
    newArts[Number(el-1)].content = e.target.value;
    setArts(newArts);
  }

  const handleArtSubContent = (el, e) => {
    let newArts = [...arts.slice(0, Number(el-1)), {...arts[Number(el-1)]}, ...arts.slice(Number(el), 9)]
    newArts[Number(el-1)].subContent = e.target.value;
    setArts(newArts);
  }

  AWS.config.update({
    region: "ap-northeast-2", // 버킷이 존재하는 리전
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "ap-northeast-2:a17da5be-96ef-4046-aaa8-62455cef2362", // cognito 인증 풀에서 받아온 키
    }),
  });

  const handleArtImg = (el, e) => {
    let newArts = [...arts.slice(0, Number(el-1)), {...arts[Number(el-1)]}, ...arts.slice(Number(el), 9)]

    const imageFile = e.target.files[0];
    if (!imageFile) {
      newArts[Number(el-1)].img = null;
      return setArts(newArts);
    }

    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: "pickmeupimagestorage",
        Key: imageFile.name,
        Body: imageFile,
      },
    });

    const promise = upload.promise();

    promise.then(
      function (data) {
        newArts[Number(el-1)].img = data.Location;
        setArts(newArts);
      },
      function (err) {
        console.log(err);
      }
    );
  }

  const createGallery = () => {
    axios.post(
      "https://localhost:5000/exhibition/register",
      {
        title: title,
        startDate: startDate,
        endDate: endDate,
        exhibitType: type,
        genreHashtags: JSON.stringify(isClicked), //배열이니까 JSON 처리
        exibitInfo: arts[0].img, //썸네일로 쓰일 대표작 1점(첫번째 작품)
        images: JSON.stringify(arts) //배열이니까 JSON 처리
      }
    );
  }


  return (
    <section className={styles.container}>
      <h2 className={styles.title}>전시 신청</h2>

      <div className={styles.categoryName}>전시명</div>
      <input className={styles.textInput} 
      type="text" onChange={handleTitle}/>

      <div className={styles.categoryName}>전시 시작일</div>
      <input className={styles.textInput} 
      type="text" placeholder="전시 시작일은 신청일로부터 7일 이후 날짜로 설정 가능합니다." 
      onChange={handleStartDate}/>

      <div className={styles.categoryName}>전시 마감일</div>
      <input className={styles.textInput} 
      type="text" placeholder="최대 전시 가능한 기간은 90일입니다." 
      onChange={handleEndDate}/>

      <div className={styles.categoryName}>전시 타입</div>
      <div className={styles.types}>
        <input type="radio" name="type" value="1" 
        className={styles.typeBtn} 
        onChange={handleType}/><label className={styles.type}>Standard</label>
        <input type="radio" name="type" value="2" className={styles.typeBtn} 
        onChange={handleType}/><label className={styles.type}>Premium</label>
      </div>

      <div className={styles.categoryName}>전시 장르<span class={styles.subGenre}>(복수선택가능)</span></div>
      <div className={styles.tags}>
        {tags.map((el) => 
            <>
              <input type="checkbox" name={el} value={el} />
              <label className={isClicked.includes(el) ? styles.hashtagClicked : styles.hashtag} onClick={() => tagHandle(el)}>{el}</label>
            </>
        )}
      </div>

      {artCount.map(el => 
      <>
        <div className={styles.categoryName}>작품{el}</div>
        <div className={styles.artWrap}>
          <div className={styles.artContent}>
            <input className={styles.artTextInput} 
            type="text" 
            placeholder="작품명" 
            onChange={e => handleArtTitle(el, e)}
            />
            <input className={styles.artTextInput} 
            type="text" 
            placeholder="제작연도/재료/크기" 
            onChange={e => handleArtContent(el, e)}
            />
            <input className={styles.contentInput} 
            type="textarea" 
            placeholder="작품설명" 
            onChange={e => handleArtSubContent(el, e)}
            />
          </div>
          <div className={styles.artFile}>
            <input className={styles.fileInput} 
            type="file" id="ex_file" 
            accept="image/*" 
            onChange={e => handleArtImg(el, e)}
            ></input>
            <img className={styles.artImg} src={
            arts[Number(el-1)].img ? 
            arts[Number(el-1)].img : 
            "../../../images/Black on White.png"
            }
            alt="작품이미지"/>
          </div>
        </div>
      </> 
      )}
      <div className={styles.submit}>
        <button className={styles.submitBtn} onClick={createGallery}>신청</button>
        <button className={styles.submitBtn}>취소</button>
      </div>

    </section>
  )
}

export default Register;