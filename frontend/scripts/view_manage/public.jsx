/**
 * Created by kelvinsun on 2016/5/4.
 */
'use strict';

define(['react', 'ReactRouter'], (React, ReactRouter) => {
    const { Link } = ReactRouter;

    const menus = [{
        name: '首页',
        link: '/',
    },{
        name: '内容管理',
        link: '/news',
    },{
        name: '类别管理',
        link: '/classification',
    },{
        name: '资源管理',
        link: '/resource',
    },{
        name: '样式管理',
        link: '/style',
    },];

    class Navigation extends React.Component {
        constructor (props) {
            super(props);
        }
        render () {
            return (
                <div className="navbar navbar-default navigation">
                    <div className="color-line"></div>
                    <div className="container-fluid">
                        <div className="navbar-header col-sm-3 col-lg-2">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navigator-collapse-all">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">哈尔滨工业大学(威海)</a>
                        </div>
                    </div>
                    <div className="collapse navbar-collapse" id="navigator-collapse-all">
                        <ul className="nav navbar-nav">
                            {menus.map(item =>
                                <li>
                                    <Link to={item['link']}>{item['name']}</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            );
        }
    }

    class Menu extends React.Component {
        constructor (props) {
            super(props);
        }
        render () {
            return (
                <div className="col-sm-3 col-lg-2 hidden-xs">
                    <ul>
                        {menus.map(item =>
                            <li><Link to={item['link']}>{item['name']}</Link></li>
                        )}
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
