'use strict';

define([
    'react',
    'ReactRouter',
    'react-redux',
    'common/util',
    'common/redux_helper',
    'root/config',
    'root/store',
], (React, Router, ReactRedux, commonUtil, reduxHelper, config, store) => {
    const { mapStateToProps, mapDispatchToProps } = reduxHelper;
    const { Provider, connect } = ReactRedux;
    const { Link }      = Router;
    const pagerSize     = config['pagerSize']   || 2,
          pageSize      = config['pageSize']    || 20,
          pageRequest   = config['pageRequest'] || 0,
          navigatorSize = config['style'] && config['style']['navigator'] ? config['style']['navigator'] : 7,
          headerSize    = config['style'] && config['style']['header']    ? config['style']['header']    : 0,
          footerSize    = config['style'] && config['style']['footer']    ? config['style']['footer']    : 2,
          shortcutSize  = config['style'] && config['style']['shortcut']  ? config['style']['shortcut']  : 0;
    // TODO 兼容 LINK ?
    /**
     * 页码生成组件
     * @param   current 当前页码
     * @param   max     总页码数
     * @param   link    页码链接, 字符串, 其中需要有 {#page} 标记, 用于将此处替换为请求的页码
     */
    class Pager extends React.Component {
        constructor (props) {
            super(props);
        }
        render () {
            let tempCurrent = +this.props.current,
                tempMax     = +this.props.max,
                tempLink    = this.props.link || '';
            let pagerArray  = [tempCurrent];
            if (tempMax <= 1) {
                return <div></div>;
            }
            // 生成对应的前一页 / 后一页
            const prevLink = tempCurrent <= 0 ?
                (<li className="disabled">
                    <a href={tempLink.replace(/\{#page}/, tempCurrent + '')}>&laquo;</a>
                </li>) :
                (<li>
                    <a href={tempLink.replace(/\{#page}/, tempCurrent - 1 + '')}>&laquo;</a>
                </li>);
            const nextLink = tempCurrent >= tempMax ?
                (<li className="disabled">
                    <a href={tempLink.replace(/\{#page}/, tempCurrent + '')}>&raquo;</a>
                </li>) :
                (<li>
                    <a href={tempLink.replace(/\{#page}/, +tempCurrent + 1 + '')}>&raquo;</a>
                </li>);
            // 来回徘徊插值, 确保页码尺寸最合理
            for (
                let pagerCount = 1;
                 pagerArray.length < 2 * pagerSize + 1 && pagerCount < 2 * pagerSize + 1;
                ++pagerCount
            ) {
                if (tempCurrent - pagerCount >= 0) {
                    pagerArray.push(+tempCurrent - pagerCount);
                }
                if (tempCurrent + pagerCount < tempMax) {
                    pagerArray.push(+tempCurrent + pagerCount);
                }
            }
            pagerArray = pagerArray.sort();
            return (
                <ul className="pagination">
                    {prevLink}
                    {pagerArray.map(pager =>
                        // pageCurrent 是字符串, pager 是数字
                        (<li key={pager} className={pager == tempCurrent ? 'active' : ''}>
                            <a href={tempLink.replace(/\{#page}/, pager)}>{+pager + 1}</a>
                        </li>)
                    )}
                    {nextLink}
                </ul>
            );
        }
    }
    Pager.defaultProps = { current: 0, max: 0, link: '', pathname: '', query: {} };
    // 导航栏的单个选项列表
    const NavigatorItem = props => (
        <li className="dropdown">
            {!!props.list && !!props.list.length ? [
                <a key="name" href="javascript:;"
                   className="dropdown-toggle" data-toggle="dropdown" role="button">
                    {props.name}
                </a>,
                <div key="icon"><span className="glyphicon glyphicon-chevron-down"></span></div>,
                <ul key="list" className="dropdown-menu">
                    {props.list.map((item, index) =>
                        <li key={index}>
                            {!!item['id'] ?
                                <Link to={{ pathname: `/browse/news/${item['type']}`,
                                            query: { id: item['id'], pageSize, pageRequest }}}>
                                    {item['name']}
                                </Link> :
                                <a href={item['link'] || 'javascript:;'}>{item['name']}</a>
                            }
                        </li>
                    )}
                </ul>
            ] : (
                !!props.id ?
                    <Link to={{ pathname: `/browse/news/${props.type}`,
                                query: { id: props.id, pageSize, pageRequest }}}
                        className="dropdown-toggle">
                        {props.name}
                    </Link> :
                    !!props.link ? <a href={props.link}>{props.name}</a> : ''
            )}
        </li>
    );
    NavigatorItem.defaultProps = { title: '', id: 0, type: 'category', category: [], };
    // 导航栏
    class Navigation extends React.Component {
        constructor (props) {
            super(props);
            this.state = Navigation.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(Navigation.getState(nextProps));
        }
        static getState (state) {
            let list =
                !state || !state['style'] || !state['style']['navigator'] ||
                !Array.isArray(state['style']['navigator']) ?
                    [] :
                    state['style']['navigator'];
            list = list.slice(0, navigatorSize || list.length);
            const needDecoration = !('/' === state['pathname'] || '/index' === state['pathname']);
            return { list, needDecoration };
        }
        render () {
            return (
                <div className="navbar navigation">
                    <div className="container">
                        <div className="navbar-header visible-xs">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navigator-collapse-all">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">哈尔滨工业大学(威海)&nbsp;软件学院</a>
                        </div>
                        <div className="collapse navbar-collapse" id="navigator-collapse-all">
                            <ul className="nav navbar-nav">
                                <li className={this.state.needDecoration ? 'light' : ''}>
                                    <Link to="index">首页</Link>
                                </li>
                                {this.state.list.map((item, index) =>
                                    <NavigatorItem key={index} {...item}/>
                                )}
                            </ul>
                        </div>
                    </div>
                    {this.state.needDecoration ?
                        <div className="decoration container">
                            <section>Welcome to the School of Software</section>
                            <div className="arrow-down"></div>
                        </div> :
                        ''
                    }
                </div>
            );
        }
    }
    Navigation.defaultProps = { navigator: [] };
    // 每个页面里面左边的快捷入口
    class Shortcut extends React.Component {
        constructor (props) {
            super(props);
            this.state = Shortcut.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(Shortcut.getState(nextProps));
        }
        static getState (state) {
            let list =
                !state || !state['style'] || !state['style']['shortcut'] ||
                !Array.isArray(state['style']['shortcut']) ?
                    [] :
                    state['style']['shortcut'];
            list = list.slice(0, shortcutSize || list.length);
            return { list };
        }
        render () {
            return (
                <aside className="list-group shortcut-box">
                    {this.state.list.map((item, index) =>
                        !!item['id'] ?
                            <Link className="list-group-item" key={index}
                                  to={{ pathname: `/browse/news/${item['type']}`,
                                        query: { id: item['id'], pageSize, pageRequest }}}>
                                {item['name']}
                            </Link> :
                            !!item['link'] ?
                                <a className="list-group-item" href={item['link'] || 'javascript:;'}>
                                    {item['name']}
                                </a> :
                                ''
                    )}
                    <Link to={{ pathname: "/browse/resource", query: { pageSize, pageRequest }}}
                          className="list-group-item">资源下载</Link>
                </aside>
            );
        }
    }
    Shortcut.defaultProps = { shortcut: [] };
    // 标题栏
    const TitleLine = ({ title }) => (
        <header>{title}</header>
    );
    TitleLine.defaultProps = { title: '' };
    // 抬头栏
    class HeaderLine extends React.Component {
        constructor (props) {
            super(props);
            this.state = HeaderLine.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(HeaderLine.getState(nextProps));
        }
        static getState (state) {
            let list =
                !state || !state['style'] || !state['style']['header'] ||
                !Array.isArray(state['style']['header']) ?
                    [] :
                    state['style']['header'];
            list = list.slice(0, headerSize || list.length);
            return { list };
        }
        render () {
            return (
                <div className="container hidden-xs header">
                    <div className="row">
                        <div className="col-sm-6">
                            <a href="#" className="logo">
                                <img src="/public/images/LogoTitle.png" alt="首页"/>
                            </a>
                        </div>
                        <div className="col-sm-6 child-right">
                            <div>
                                <ul className="breadcrumb">
                                    {this.state.list.map((item, index) =>
                                        <li key={index}>
                                            <Link to={{ pathname: `/browse/news/${item['type']}`,
                                                        query: { id: item['id'], pageSize, pageRequest }}}>
                                                {item['name']}
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <form action="#">
                                    <input type="search"/>
                                    <button type="submit"><span className="glyphicon glyphicon-search"></span></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
    // 页脚的单个选项列表
    const FooterItem = props => (
        <div className="col-xs-12 col-sm-6 col-md-3">
            <h1>{props.title}</h1>
            <ul>
                {props.category.map((item, index) =>
                    <li key={index}>
                        <Link to={{ pathname: `/browse/news/${item['type']}`,
                                    query: { id: item['id'], pageSize, pageRequest }}}>
                            {item['name']}
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
    FooterItem.defaultProps = { title: '', category: [] };
    // 页脚
    class Footer extends React.Component {
        constructor (props) {
            super(props);
            this.state = Footer.getState(props);
        }
        componentWillReceiveProps (nextProps) {
            this.setState(Footer.getState(nextProps));
        }
        static getState (state) {
            let list =
                !state || !state['style'] || !state['style']['footer'] ||
                !Array.isArray(state['style']['footer']) ?
                    [] :
                    state['style']['footer'];
            list = list.slice(0, footerSize || list.length);
            return { list };
        }
        render () {
            return (
                <div className="container-fluid footer-container">
                    <div className="title row">
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12">
                                    <ul>
                                        <li>
                                            <a href="/moodle">教学在线</a>
                                        </li>
                                        <li>
                                            <a href="/map">网站地图</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer className="container">
                        <div className="row">
                            {this.state.list.map((item, index) =>
                                <FooterItem key={index} id={item['id']} type={item['type']}
                                            title={item['name']} category={item['list']}/>
                            )}
                            <div className="footer-information col-xs-12 col-md-6">
                                <a className="logo" href="//www.hitwh.edu.cn">
                                    <img src="/public/images/LogoFooter.png" alt="哈尔滨工业大学(威海)"/>
                                </a>
                                <p>&copy;版权所有：哈尔滨工业大学（威海）软件学院 Werun Club</p>
                                <p>山东省威海市文化西路2号 邮编：264209</p>
                                <p>
                                    <a href="/page/manage">管理员登录</a>
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
            );
        }
    }
    Footer.defaultProps = { footer: [] };

    const ConnectNavigation = connect(mapStateToProps, mapDispatchToProps)(Navigation);
    const ConnectShortcut   = connect(mapStateToProps, mapDispatchToProps)(Shortcut);
    // const ConnectTitleLine  = connect(mapStateToProps, mapDispatchToProps)(TitleLine);
    const ConnectHeaderLine = connect(mapStateToProps, mapDispatchToProps)(HeaderLine);
    const ConnectFooter     = connect(mapStateToProps, mapDispatchToProps)(Footer);

    return {
        Navigation: (props) =>
            (<Provider store={store}>
                <ConnectNavigation pathname={props.pathname}/>
            </Provider>),
        Shortcut: () =>
            (<Provider store={store}>
                <ConnectShortcut/>
            </Provider>),
        TitleLine,
        // TitleLine: () =>
        //     (<Provider store={store}>
        //         <ConnectTitleLine/>
        //     </Provider>),
        Header: () =>
            (<Provider store={store}>
                <ConnectHeaderLine/>
            </Provider>),
        Footer: () =>
            (<Provider store={store}>
                <ConnectFooter/>
            </Provider>),
        Pager,
    };
});