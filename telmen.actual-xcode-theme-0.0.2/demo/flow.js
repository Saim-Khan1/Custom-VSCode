// @flow

import * as React from "react";
import { graphql } from "react-relay";
import { useFragment } from "relay-experimental";
import { type SubmissionContent_submission$key } from "SubmissionContent_submission.graphql";

import {
  SubmissionContentRow,
  type SubmissionContentRowType
} from "~/Components/SubmissionContentRow";
import { LAYOUT_TYPES, LayoutTypeContext } from "~/Contexts/LayoutType";
import { ScrollContextProvider } from "~/Contexts/Scroll";
import { default as List } from "~/Forks/react-window/DynamicSizeList";
import { useLayoutViewportSize } from "~/Hooks/useLayoutViewportSize";
import { useSafeAreaInsets } from "~/Hooks/useSafeAreaInsets";
import { useSessionState } from "~/Hooks/useSessionState";
import { useRouteKey } from "~/Router/index.mjs";
import {
  LayoutMargin,
  NavigationBarHeight,
  SidebarWidth
} from "~/Styles/Sizes";
const test = true;
type ListProps = {| listData: Array<SubmissionContentRowType> |};
function SubmissionContentList(props: ListProps) {
  const routeKey = useRouteKey();

  const scrollRef = React.useRef(null);
  const [scrollOffset, setScrollOffset] = useSessionState(
    0,
    `scroll-${routeKey}`,
    false
  );

  const layoutType = React.useContext(LayoutTypeContext);
  const isMobile = layoutType === LAYOUT_TYPES.MOBILE;

  const { width, height } = useLayoutViewportSize();
  const insets = useSafeAreaInsets();

  const sidebarWidth = isMobile ? 0 : insets.left + SidebarWidth;

  const topSpacing = Math.max(5, 5 + insets.top - LayoutMargin);
  const headerHeight = NavigationBarHeight + topSpacing;

  React.useLayoutEffect(
    () => {
      const scrollElem = scrollRef.current;
      return () => {
        if (scrollElem) {
          setScrollOffset(scrollElem.scrollTop);
        }
      };
    },
    [setScrollOffset]
  );

  return (
    <ScrollContextProvider>
      {/* $FlowFixMe */}
      <List
        outerRef={scrollRef}
        initialScrollOffset={scrollOffset}
        overscanCount={3}
        estimatedItemSize={100}
        style={{
          ...submissionContentStyles.list,
          paddingTop: headerHeight
        }}
        width={width - sidebarWidth}
        height={height}
        itemCount={props.listData.length}
        itemData={props.listData}
      >
        {SubmissionContentRow}
      </List>
    </ScrollContextProvider>
  );
}

const submissionContentStyles = {
  list: {
    paddingBottom: LayoutMargin * 2,
    contain: "strict",
    overscrollBehavior: "contain"
  }
};

type Props = {|
  +submission: SubmissionContent_submission$key
|};
function SubmissionContent(props: Props) {
  const submission = useFragment(
    graphql`
      fragment SubmissionContent_submission on Submission {
        is_self
        ...SubmissionContent_comments
        ...SelfText_submission
        ...SubmissionItem_submission
      }
    `,
    props.submission
  );

  let commentsResult;
  // try {
  // TODO: Figure out how to actually partially fetch this fragment
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { comments } = useFragment(
    graphql`
      fragment SubmissionContent_comments on Submission {
        comments(sort: TOP, threaded: false) {
          ...Comment_comment
        }
      }
    `,
    submission
  );
  commentsResult = { loading: false, comments };
  // } catch (err) {
  //   commentsResult = { loading: true, comments: null };
  // }

  const listData: Array<SubmissionContentRowType> = React.useMemo(
    () => {
      console.log(`foo ${bar()}`)
      let listData = [{ type: "submission", submission }];

      const { is_self } = submission;
      if (is_self) {
        const selfSection = { type: "self", submission };
        listData.push(selfSection);
      }

      if (commentsResult.loading) {
        listData.push({ type: "loading" });
      } else {
        const { comments } = commentsResult;
        listData = listData.concat(
          comments
            .filter(Boolean)
            .map(comment => ({ type: "comment", comment }))
        );
      }

      return listData;
    },
    [commentsResult, submission]
  );

  return <SubmissionContentList listData={listData} />;
}

const MemoizedSubmissionContent: React.ComponentType<Props> = React.memo(
  SubmissionContent
);

export { MemoizedSubmissionContent as SubmissionContent };
