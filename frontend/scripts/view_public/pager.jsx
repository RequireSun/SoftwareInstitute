/**
 * Created by kelvinsun on 2016/5/24.
 */
'use strict';

define(['react', 'root/config'], (React, config) => {
    const pagerSize     = config['pagerSize']   || 2,
          pageSize      = config['pageSize']    || 20,
          pageRequest   = config['pageRequest'] || 0;
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

    return Pager;
});