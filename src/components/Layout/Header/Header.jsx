import React from 'react';
import { HiSearchCircle } from 'react-icons/hi';
import { MdHomeFilled } from 'react-icons/md';
import { RiNeteaseCloudMusicLine, RiPlayList2Fill } from 'react-icons/ri';
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
        <NavLink to="/playlist" activeclassname="active">
          <span>
            <RiPlayList2Fill />
          </span>
          Playlists
        </NavLink>
      </nav>
    </div>
  );
}

export default Header;
