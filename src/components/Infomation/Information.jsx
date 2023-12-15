import React from 'react';
import './Information.scss';
function Information(props) {
  return (
    <div className="information">
      <div className="information__header">
        <h3>Thông tin dự án</h3>
      </div>
      <div className=''>
        <p>Github Frontend: <a href='https://github.com/sondev811/smusic'>Frontend</a> </p>
        <p>Github Backend: <a href='https://github.com/sondev811/smusic-be'>Backend</a> </p>
        <p>Develop by: <a href='https://github.com/sondev811'>Github</a></p>
        <p>Linkedin: <a href='https://www.linkedin.com/in/sondev811/'>Linkedin</a></p>
        <p>Facebook: <a href='https://www.facebook.com/sondev811/'>Facebook</a></p>
        {/* <p>Facebook: <a href='https://www.facebook.com/vo.ngoc.tran.811/'>Võ Ngọc Trân</a></p> */}
      </div>
    </div>
  );
}

export default Information;