import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Review.module.css';

const Review = ({ exhibition, selectReview }) => {

  return(
   
      <li className={styles.container}>
        <div className={styles.imgBox}>
          <Link to='/reviewdetail'>
            <div className={styles.layer}
            onClick={()=> selectReview(exhibition)}></div>
            <img className={styles.thumbnail} 
            onClick={()=> selectReview(exhibition)}
            src={exhibition.images[0].image_urls} alt="thumbnail"/>
          </Link>
        </div>
        <div className={styles.metaData}>
          <div>
            <span className={styles.title}>{exhibition.title}</span>
            <span className={styles.period}>전시 기간: {exhibition.start_date} ~ {exhibition.end_date}</span>
          </div>
          <div className={styles.titleAndBtn}>
            <span className={styles.reviewCount}>총 {exhibition.comments.length}개의 리뷰가 있어요</span>
            <div className={styles.btnWrap}>
            <Link to='/reviewdetail'>
              <button className={styles.reviewBtn}
              onClick={()=> selectReview(exhibition)}>리뷰 쓰러가기</button>
            </Link>
            </div>
          </div>
        </div>
      </li>
   
  )
}

export default Review;