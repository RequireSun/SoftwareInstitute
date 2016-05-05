/**
 * Created by kelvinsun on 2016/5/4.
 */
'use strict';

define(['react', 'React'], (React) => {
    class Navigation extends React.Component {
        constructor (props) {
            super(props);
        }
        render () {
            return (
                <div></div>
            );
        }
    }

    class Menu extends React.Component {
        constructor (props) {
            super(props);
        }
        render () {
            return (
                <div>
                    <ul>
                        <li><Link to="/">首页</Link></li>
                        <li><Link to="/news">内容管理</Link></li>
                        <li><Link to="/classification">类别管理</Link></li>
                        <li><Link to="/resource">资源管理</Link></li>
                        <li><Link to="/style">样式管理</Link></li>
                    </ul>
                </div>
            );
        }
    }

    return {
        Navigation,
        Menu,
    };
});
