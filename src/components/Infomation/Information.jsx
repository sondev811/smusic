import React from 'react';
import './Information.scss';
function Information(props) {
  return (
    <div className="information">
      <div className="information__header">
        <h3>Thông tin dự án</h3>
      </div>
      <div className=''>
        <p>Github Frontend: <a href='https://github.com/sondev811/smusic'>https://github.com/sondev811/smusic</a> </p>
        <p>Github Backend: <a href='https://github.com/sondev811/smusic-be'>https://github.com/sondev811/smusic-be</a> </p>
        <p>Develop by: <a href='https://github.com/sondev811'>https://github.com/sondev811</a></p>
        <p>Linkedin: <a href='https://www.linkedin.com/in/sondev811/'>https://www.linkedin.com/in/sondev811/</a></p>
        <p>Facebook: <a href='https://www.facebook.com/sondev811/'>https://www.facebook.com/sondev811/</a></p>
      </div>
    </div>
  );
}

export default Information;