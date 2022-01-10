import React from 'react';
import { loadingContentStore, loadingStore, useAppSelector } from '../../hooks';
import './Loading.scss';
function Loading(props) {
    const loading = useAppSelector(loadingStore);
    const content = useAppSelector(loadingContentStore);
    return (
        <div className={`loading ${loading ? 'active' : ''}`}>
            <div>
                <div className='loader'></div>
                {content && <span style={{color: '#fff', fontSize: '20px', fontWeight: '600', textAlign: 'center'}}>{content}</span>}
            </div> 
        </div>
    );
}

export default Loading;