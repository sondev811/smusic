import React from 'react';
import { BsMusicNoteList } from 'react-icons/bs';
import { HiSearchCircle } from 'react-icons/hi';
import { MdHomeFilled } from 'react-icons/md';
import { RiNeteaseCloudMusicLine } from 'react-icons/ri';
import { NavLink } from 'react-router-dom';
import './Header.scss';

function Header() {
  return (
    <div className="header">
      <div className="header__logo">
        <RiNeteaseCloudMusicLine />
        SMusic
      </div>
      <nav>
        <NavLink to="/" activeclassname="active">
          <span>
            <MdHomeFilled />
          </span>
          Trending
        </NavLink>
        <NavLink to="/search" activeclassname="active">
          <span>
            <HiSearchCircle />
          </span>
          Tìm kiếm
        </NavLink>
        <NavLink to="/queue" activeclassname="active">
          <span>
            <BsMusicNoteList />
          </span>
          Hàng đợi
        </NavLink>
      </nav>
    </div>
  );
}

export default Header;
