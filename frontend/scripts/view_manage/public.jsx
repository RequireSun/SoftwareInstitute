/**
 * Created by kelvinsun on 2016/5/4.
 */
'use strict';

define(['react', 'ReactRouter', 'root/config_manage'], (React, ReactRouter, mConfig) => {
    const { Link } = ReactRouter;
    const menus = mConfig['menus'] || [];
    // const menus = [{
    //     name: '首页',
    //     link: '/',
    // },{
    //     name: '内容管理',
    //     link: '/news',
    // },{
    //     name: '类别管理',
    //     link: '/classification',
    // },{
    //     name: '资源管理',
    //     link: '/resource',
    // },{
    //     name: '样式管理',
    //     link: '/style',
    // },];

    class Navigation extends React.Component {
        constructor (props) {
            super(props);
        }
        render () {
            return (
                <div className="navigation navbar navbar-default navbar-fixed-top">
                    <div className="color-line"></div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="navbar-header col-sm-3 col-lg-2">
                                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navigator-collapse-all">
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                                <a className="navbar-brand" href="#">哈尔滨工业大学(威海)</a>
                            </div>
                        </div>
                    </div>
                    <div className="collapse navbar-collapse" id="navigator-collapse-all">
                        <ul className="nav navbar-nav">
                            {menus.map(item =>
                                <li key={item['link']}>
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
                <aside className="menu">
                    <ul className="nav">
                        {menus.map(item =>
                            <li key={item['link']} className={item['link'] === this.props.pathname ? 'active' : ''}>
                                <Link to={item['link']}>{item['name']}</Link>
                            </li>
                        )}
                    </ul>
                </aside>
            );
        }
    }

    return {
        Navigation,
        Menu,
    };
});
