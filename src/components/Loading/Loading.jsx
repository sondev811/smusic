import React from 'react';
import { loadingContentStore, loadingStore } from '../../features';
import { useAppSelector } from '../../hooks';
import './Loading.scss';
function Loading(props) {
    const loading = useAppSelector(loadingStore);
    const content = useAppSelector(loadingContentStore);
    return (
        <div className={`loading ${loading ? 'active' : ''}`}>
            <div>
                <div className="lds-ellipsis" style={{display: 'block', margin: '0 auto'}}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                {content && <span style={{color: '#fff', fontSize: '20px', fontWeight: '600'}}>{content}</span>}
            </div> 
        </div>
    );
}

export default Loading;