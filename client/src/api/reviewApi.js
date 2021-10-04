import axios from "axios";

export async function getAllGallery(sortValue, search) {
  //standard, premium 모든 전시. 승인완료 & 전시마감 모두!

  try {
    const res = await axios.get("https://art-ground.link/review");
    if (search === "") {
      //검색 안 할 때
      if (sortValue === "최신순") {
        return res.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else {
        //인기순
        return res.data.data.sort(
          (a, b) => b.comments.length - a.comments.length
        );
      }
    } else {
      //검색
      let result = res.data.data.filter((el) => {
        return el.title.toLowerCase().includes(search.toLowerCase());
      });
      if (sortValue === "최신순") {
        return result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else {
        //인기순
        return result.sort((a, b) => b.comments.length - a.comments.length);
      }
    }
  } catch (err) {
    return console.log(err);
  }
}

export async function getReplyList(postId) {
  try {
    const res = await axios.get(`https://art-ground.link/review/${postId}`);
    console.log(res.data.commentsData.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    ))
    return res.data.commentsData.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (err) {
    return console.log(err);
  }
}
export async function getExhibitionInfo(postId) {
  try {
    const res = await axios.get(`https://art-ground.link/review/${postId}`);
    const exhibitionData = { ...res.data.exhibitionData, genre_hashtags: JSON.parse(res.data.exhibitionData.genre_hashtags) }
    const thumbnail = res.data.thumbnail[0].image_urls
    return {
      exhibitionData: exhibitionData,
      thumbnail: thumbnail
    }
  } catch (err) {
    return console.log(err);
  }
}

export async function postReview(reply, postId) {
  try {
    await axios.post("https://art-ground.link/review", {
      postId: postId,
      comments: reply,
    });
    //console.log(res);
  } catch (err) {
    return console.log(err);
  }
}

export async function deleteReview(postId, commentsId) {
  try {
    await axios.delete(`https://art-ground.link/review/${postId}/${commentsId}`);
    //console.log(res);
  } catch (err) {
    return console.log(err);
  }
}
