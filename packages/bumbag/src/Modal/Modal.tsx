import * as React from 'react';
import { Box as ReakitBox, DialogProps as ReakitDialogProps, useDialog as useReakitDialog } from 'reakit';

import { AnimateProps, Placement } from '../types';
import { useClassName, createComponent, createElement, createHook, merge, omitCSSProps } from '../utils';
import { Box, BoxProps } from '../Box';

import { ModalBackdrop } from './ModalBackdrop';
import { ModalContext } from './ModalState';
import * as styles from './styles';

export type LocalModalProps = {
  /** Hides the backdrop. */
  hideBackdrop?: boolean;
  /** Sets the placement of the modal. */
  placement?: Placement;
} & AnimateProps;
export type ModalProps = BoxProps & ReakitDialogProps & LocalModalProps;

const useProps = createHook<Partial<ModalProps>>(
  (props, { themeKey }) => {
    const modalContext = React.useContext(ModalContext);
    props = { ...props, ...modalContext.modal };

    let {
      children,
      hideBackdrop,
      hide,
      hideOnEsc,
      hideOnClickOutside,
      modal,
      preventBodyScroll,
      visible,
      animating,
      animated,
      baseId,
      unstable_initialFocusRef,
      unstable_finalFocusRef,
      unstable_orphan,
      unstable_autoFocusOnHide,
      unstable_autoFocusOnShow,
      stopAnimation,
      ...htmlProps
    } = props;
    const modalProps = useReakitDialog(
      {
        hide,
        hideOnEsc,
        hideOnClickOutside,
        modal,
        preventBodyScroll,
        visible,
        animating,
        animated,
        baseId,
        unstable_initialFocusRef,
        unstable_finalFocusRef,
        unstable_orphan,
        unstable_autoFocusOnHide,
        unstable_autoFocusOnShow,
        stopAnimation,
      },
      htmlProps
    );
    htmlProps = Box.useProps({
      ...props,
      ...modalProps,
    });

    const className = useClassName({
      style: styles.Modal,
      styleProps: props,
      themeKey,
      prevClassName: htmlProps.className,
    });

    return {
      ...htmlProps,
      className,
      children: (
        <React.Fragment>
          {!hideBackdrop && (
            <ModalBackdrop {...omitCSSProps(props)}>
              <div />
            </ModalBackdrop>
          )}
          {children}
        </React.Fragment>
      ),
    };
  },
  {
    defaultProps: {
      placement: 'center',
    },
    themeKey: 'Modal',
  }
);

export const Modal = createComponent<Partial<ModalProps>>(
  (props) => {
    const modalProps = useProps(props);
    return createElement({ children: props.children, component: ReakitBox, use: props.use, htmlProps: modalProps });
  },
  {
    attach: {
      useProps,
      displayName: 'Modal',
    },
    themeKey: 'Modal',
  }
);
