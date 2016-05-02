'use strict';

define([
    'react',
    'ReactRouter',
    'react-redux',
    'common/util',
    'common/redux_helper',
    'root/config',
    'root/store',
    'action/news'
], (React, Router, ReactRedux, commonUtil, reduxHelper, config, store, actionNews) => {
    const { Link }      = Router;
    const { Provider }  = ReactRedux;
    const pagerSize     = config['pagerSize']   || 2,
          pageSize      = config['pageSize']    || 20,
          pageRequest   = config['pageRequest'] || 0,
          navigatorSize = config['style'] && config['style']['navigator'] ? config['style']['navigator'] : 7,
          headerSize    = config['style'] && config['style']['header']    ? config['style']['header']    : 0,
          footerSize    = config['style'] && config['style']['footer']    ? config['style']['footer']    : 2,
          shortcutSize  = config['style'] && config['style']['shortcut']  ? config['style']['shortcut']  : 0;
    // TODO page 的 prop state 逻辑明显不对
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
            let tempCurrent = this.props.current,
                tempMax     = this.props.max,
                tempLink    = this.props.link || '';
            let pagerArray  = [tempCurrent];
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
                    pagerArray.push(tempCurrent - pagerCount);
                }
                if (tempCurrent + pagerCount <= tempMax) {
                    pagerArray.push(tempCurrent + pagerCount);
                }
            }
            pagerArray = pagerArray.sort();
            return (
                <ul className="pagination">
                    {prevLink}
                    {pagerArray.map(pager =>
                        // pageCurrent 是字符串, pager 是数字
                        (<li className={pager == tempCurrent ? 'active' : ''}>
                            <a href={tempLink.replace(/\{#page}/, pager)}>{pager}</a>
                        </li>)
                    )}
                    {nextLink}
                </ul>
            );
        }
    }
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
                                <Link to="newsList" params={{ newsType: item['type'] }}
                                      query={{ id: item['id'], pageSize, pageRequest }}>
                                    {item['name']}
                                </Link> :
                                <a href={item['link'] || 'javascript:;'}>{item['name']}</a>
                            }
                        </li>
                    )}
                </ul>
            ] : (
                !!props.id ?
                    <Link to="newsList" params={{ newsType: props.type }}
                        query={{ id: props.id, pageSize, pageRequest }}
                        className="dropdown-toggle">
                        {props.name}
                    </Link> :
                    <a href={props.link}>{props.name}</a>
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
            return { list };
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
                            <a className="navbar-brand" href="#">哈尔滨工业大学(威海)</a>
                        </div>
                        <div className="collapse navbar-collapse" id="navigator-collapse-all">
                            <ul className="nav navbar-nav">
                                <li><Link to="index">首页</Link></li>
                                {this.state.list.map((item, index) =>
                                    <NavigatorItem key={index} {...item}/>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
    }
    Navigation.defaultProps = { navigator: [] };
    // 页脚的单个选项列表
    const FooterItem = props => (
        <ul className="nav nav-pills nav-stacked">
            {props.title}
            {props.category.map(item =>
                <li>
                    <Link to="newsList" params={{ newsType: item['type'] }}
                          query={{ id: item['id'], pageSize, pageRequest }}>{item['name']}</Link>
                </li>
            )}
        </ul>
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
                <div className="container-fluid">
                    <footer className="container">
                        {this.state.list.map((item, index) =>
                            <FooterItem key={index} id={item['id']} type={item['type']}
                                        title={item['name']} category={item['list']}/>
                        )}
                    </footer>
                </div>
            );
        }
    }
    Footer.defaultProps = { footer: [] };
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
                <div className="list-group">
                    {this.state.list.map((item, index) =>
                        <Link className="list-group-item" to="newsList"
                              key={index} params={{ newsType: item['type'] }}
                              query={{ id: item['id'], pageSize, pageRequest }}>{item['name']}</Link>
                    )}
                    <Link className="list-group-item" to="resource"
                          query={{ pageSize, pageRequest }}>资源下载</Link>
                </div>
            );
        }
    }
    Shortcut.defaultProps = { shortcut: [] };
    // 标题栏
    const TitleLine = ({ title }) => (
        <header>title</header>
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
                                            <Link to="newsList" params={{ newsType: item['type'] }}
                                                  query={{ id: item['id'], pageSize, pageRequest }}>
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

    const ConnectNavigation = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(Navigation);
    const ConnectFooter     = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(Footer);
    const ConnectShortcut   = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(Shortcut);
    const ConnectTitleLine  = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(TitleLine);
    const ConnectHeaderLine = ReactRedux.connect(reduxHelper.mapStateToProps, reduxHelper.mapDispatchToProps)(HeaderLine);

    return {
        Navigation: () =>
            (<Provider store={store}>
                <ConnectNavigation/>
            </Provider>),
        Footer: () =>
            (<Provider store={store}>
                <ConnectFooter/>
            </Provider>),
        Shortcut: () =>
            (<Provider store={store}>
                <ConnectShortcut/>
            </Provider>),
        TitleLine: () =>
            (<Provider store={store}>
                <ConnectTitleLine/>
            </Provider>),
        Header: () =>
            (<Provider store={store}>
                <ConnectHeaderLine/>
            </Provider>),
        Pager,
    };
});