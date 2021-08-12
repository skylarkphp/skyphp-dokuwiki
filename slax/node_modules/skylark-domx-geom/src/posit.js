define([
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-styler",
    "./geom"
],function(langx,noder,styler,geom){
  'use strict'

    var max = Math.max,
        abs = Math.abs,
        rhorizontal = /left|center|right/,
        rvertical = /top|center|bottom/,
        roffset = /[\+\-]\d+(\.[\d]+)?%?/,
        rposition = /^\w+/,
        rpercent = /%$/;

    function getOffsets( offsets, width, height ) {
        return [
            parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
            parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
        ];
    }

    function parseCss( element, property ) {
        return parseInt( styler.css( element, property ), 10 ) || 0;
    }

    function getDimensions( raw ) {
        if ( raw.nodeType === 9 ) {
            return {
                size: size(raw),
                offset: { top: 0, left: 0 }
            };
        }
        if ( noder.isWindow( raw ) ) {
            return {
                size: geom.size(raw),
                offset: { 
                    top: geom.scrollTop(raw), 
                    left: geom.scrollLeft(raw) 
                }
            };
        }
        if ( raw.preventDefault ) {
            return {
                size : {
                    width: 0,
                    height: 0
                },
                offset: { 
                    top: raw.pageY, 
                    left: raw.pageX 
                }
            };
        }
        return {
            size: geom.size(raw),
            offset: geom.pagePosition(raw)
        };
    }

    function getScrollInfo( within ) {
        var overflowX = within.isWindow || within.isDocument ? "" :
                styler.css(within.element,"overflow-x" ),
            overflowY = within.isWindow || within.isDocument ? "" :
                styler.css(within.element,"overflow-y" ),
            hasOverflowX = overflowX === "scroll" ||
                ( overflowX === "auto" && within.width < geom.scrollWidth(within.element) ),
            hasOverflowY = overflowY === "scroll" ||
                ( overflowY === "auto" && within.height < geom.scrollHeight(within.element));
        return {
            width: hasOverflowY ? geom.scrollbarWidth() : 0,
            height: hasOverflowX ? geom.scrollbarWidth() : 0
        };
    }

    function getWithinInfo( element ) {
        var withinElement = element || window,
            isWindow = noder.isWindow( withinElement),
            isDocument = !!withinElement && withinElement.nodeType === 9,
            hasOffset = !isWindow && !isDocument,
            msize = geom.marginSize(withinElement);
        return {
            element: withinElement,
            isWindow: isWindow,
            isDocument: isDocument,
            offset: hasOffset ? geom.pagePosition(element) : { left: 0, top: 0 },
            scrollLeft: geom.scrollLeft(withinElement),
            scrollTop: geom.scrollTop(withinElement),
            width: msize.width,
            height: msize.height
        };
    }

    function posit(elm,options ) {
        // Make a copy, we don't want to modify arguments
        options = langx.extend( {}, options );

        var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
            target = options.of,
            within = getWithinInfo( options.within ),
            scrollInfo = getScrollInfo( within ),
            collision = ( options.collision || "flip" ).split( " " ),
            offsets = {};

        dimensions = getDimensions( target );
        if ( target.preventDefault ) {

            // Force left top to allow flipping
            options.at = "left top";
        }
        targetWidth = dimensions.size.width;
        targetHeight = dimensions.size.height;
        targetOffset = dimensions.offset;

        // Clone to reuse original targetOffset later
        basePosition = langx.extend( {}, targetOffset );

        // Force my and at to have valid horizontal and vertical positions
        // if a value is missing or invalid, it will be converted to center
        langx.each( [ "my", "at" ], function() {
            var pos = ( options[ this ] || "" ).split( " " ),
                horizontalOffset,
                verticalOffset;

            if ( pos.length === 1 ) {
                pos = rhorizontal.test( pos[ 0 ] ) ?
                    pos.concat( [ "center" ] ) :
                    rvertical.test( pos[ 0 ] ) ?
                        [ "center" ].concat( pos ) :
                        [ "center", "center" ];
            }
            pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
            pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

            // Calculate offsets
            horizontalOffset = roffset.exec( pos[ 0 ] );
            verticalOffset = roffset.exec( pos[ 1 ] );
            offsets[ this ] = [
                horizontalOffset ? horizontalOffset[ 0 ] : 0,
                verticalOffset ? verticalOffset[ 0 ] : 0
            ];

            // Reduce to just the positions without the offsets
            options[ this ] = [
                rposition.exec( pos[ 0 ] )[ 0 ],
                rposition.exec( pos[ 1 ] )[ 0 ]
            ];
        } );

        // Normalize collision option
        if ( collision.length === 1 ) {
            collision[ 1 ] = collision[ 0 ];
        }

        if ( options.at[ 0 ] === "right" ) {
            basePosition.left += targetWidth;
        } else if ( options.at[ 0 ] === "center" ) {
            basePosition.left += targetWidth / 2;
        }

        if ( options.at[ 1 ] === "bottom" ) {
            basePosition.top += targetHeight;
        } else if ( options.at[ 1 ] === "center" ) {
            basePosition.top += targetHeight / 2;
        }

        atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
        basePosition.left += atOffset[ 0 ];
        basePosition.top += atOffset[ 1 ];

        return ( function(elem) {
            var collisionPosition, using,
                msize = geom.marginSize(elem),
                elemWidth = msize.width,
                elemHeight = msize.height,
                marginLeft = parseCss( elem, "marginLeft" ),
                marginTop = parseCss( elem, "marginTop" ),
                collisionWidth = elemWidth + marginLeft + parseCss( elem, "marginRight" ) +
                    scrollInfo.width,
                collisionHeight = elemHeight + marginTop + parseCss( elem, "marginBottom" ) +
                    scrollInfo.height,
                position = langx.extend( {}, basePosition ),
                myOffset = getOffsets( offsets.my, msize.width, msize.height);

            if ( options.my[ 0 ] === "right" ) {
                position.left -= elemWidth;
            } else if ( options.my[ 0 ] === "center" ) {
                position.left -= elemWidth / 2;
            }

            if ( options.my[ 1 ] === "bottom" ) {
                position.top -= elemHeight;
            } else if ( options.my[ 1 ] === "center" ) {
                position.top -= elemHeight / 2;
            }

            position.left += myOffset[ 0 ];
            position.top += myOffset[ 1 ];

            collisionPosition = {
                marginLeft: marginLeft,
                marginTop: marginTop
            };

            langx.each( [ "left", "top" ], function( i, dir ) {
                if ( positions[ collision[ i ] ] ) {
                    positions[ collision[ i ] ][ dir ]( position, {
                        targetWidth: targetWidth,
                        targetHeight: targetHeight,
                        elemWidth: elemWidth,
                        elemHeight: elemHeight,
                        collisionPosition: collisionPosition,
                        collisionWidth: collisionWidth,
                        collisionHeight: collisionHeight,
                        offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
                        my: options.my,
                        at: options.at,
                        within: within,
                        elem: elem
                    } );
                }
            } );

            if ( options.using ) {

                // Adds feedback as second argument to using callback, if present
                using = function( props ) {
                    var left = targetOffset.left - position.left,
                        right = left + targetWidth - elemWidth,
                        top = targetOffset.top - position.top,
                        bottom = top + targetHeight - elemHeight,
                        feedback = {
                            target: {
                                element: target,
                                left: targetOffset.left,
                                top: targetOffset.top,
                                width: targetWidth,
                                height: targetHeight
                            },
                            element: {
                                element: elem,
                                left: position.left,
                                top: position.top,
                                width: elemWidth,
                                height: elemHeight
                            },
                            horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
                            vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
                        };
                    if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
                        feedback.horizontal = "center";
                    }
                    if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
                        feedback.vertical = "middle";
                    }
                    if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
                        feedback.important = "horizontal";
                    } else {
                        feedback.important = "vertical";
                    }
                    options.using.call( this, props, feedback );
                };
            }

            geom.pagePosition(elem, langx.extend( position, { using: using } ));
        })(elm);
    }

    var positions = {
        fit: {
            left: function( position, data ) {
                var within = data.within,
                    withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
                    outerWidth = within.width,
                    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                    overLeft = withinOffset - collisionPosLeft,
                    overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
                    newOverRight;

                // Element is wider than within
                if ( data.collisionWidth > outerWidth ) {

                    // Element is initially over the left side of within
                    if ( overLeft > 0 && overRight <= 0 ) {
                        newOverRight = position.left + overLeft + data.collisionWidth - outerWidth -
                            withinOffset;
                        position.left += overLeft - newOverRight;

                    // Element is initially over right side of within
                    } else if ( overRight > 0 && overLeft <= 0 ) {
                        position.left = withinOffset;

                    // Element is initially over both left and right sides of within
                    } else {
                        if ( overLeft > overRight ) {
                            position.left = withinOffset + outerWidth - data.collisionWidth;
                        } else {
                            position.left = withinOffset;
                        }
                    }

                // Too far left -> align with left edge
                } else if ( overLeft > 0 ) {
                    position.left += overLeft;

                // Too far right -> align with right edge
                } else if ( overRight > 0 ) {
                    position.left -= overRight;

                // Adjust based on position and margin
                } else {
                    position.left = max( position.left - collisionPosLeft, position.left );
                }
            },
            top: function( position, data ) {
                var within = data.within,
                    withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
                    outerHeight = data.within.height,
                    collisionPosTop = position.top - data.collisionPosition.marginTop,
                    overTop = withinOffset - collisionPosTop,
                    overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
                    newOverBottom;

                // Element is taller than within
                if ( data.collisionHeight > outerHeight ) {

                    // Element is initially over the top of within
                    if ( overTop > 0 && overBottom <= 0 ) {
                        newOverBottom = position.top + overTop + data.collisionHeight - outerHeight -
                            withinOffset;
                        position.top += overTop - newOverBottom;

                    // Element is initially over bottom of within
                    } else if ( overBottom > 0 && overTop <= 0 ) {
                        position.top = withinOffset;

                    // Element is initially over both top and bottom of within
                    } else {
                        if ( overTop > overBottom ) {
                            position.top = withinOffset + outerHeight - data.collisionHeight;
                        } else {
                            position.top = withinOffset;
                        }
                    }

                // Too far up -> align with top
                } else if ( overTop > 0 ) {
                    position.top += overTop;

                // Too far down -> align with bottom edge
                } else if ( overBottom > 0 ) {
                    position.top -= overBottom;

                // Adjust based on position and margin
                } else {
                    position.top = max( position.top - collisionPosTop, position.top );
                }
            }
        },
        flip: {
            left: function( position, data ) {
                var within = data.within,
                    withinOffset = within.offset.left + within.scrollLeft,
                    outerWidth = within.width,
                    offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
                    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                    overLeft = collisionPosLeft - offsetLeft,
                    overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
                    myOffset = data.my[ 0 ] === "left" ?
                        -data.elemWidth :
                        data.my[ 0 ] === "right" ?
                            data.elemWidth :
                            0,
                    atOffset = data.at[ 0 ] === "left" ?
                        data.targetWidth :
                        data.at[ 0 ] === "right" ?
                            -data.targetWidth :
                            0,
                    offset = -2 * data.offset[ 0 ],
                    newOverRight,
                    newOverLeft;

                if ( overLeft < 0 ) {
                    newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth -
                        outerWidth - withinOffset;
                    if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
                        position.left += myOffset + atOffset + offset;
                    }
                } else if ( overRight > 0 ) {
                    newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset +
                        atOffset + offset - offsetLeft;
                    if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
                        position.left += myOffset + atOffset + offset;
                    }
                }
            },
            top: function( position, data ) {
                var within = data.within,
                    withinOffset = within.offset.top + within.scrollTop,
                    outerHeight = within.height,
                    offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
                    collisionPosTop = position.top - data.collisionPosition.marginTop,
                    overTop = collisionPosTop - offsetTop,
                    overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
                    top = data.my[ 1 ] === "top",
                    myOffset = top ?
                        -data.elemHeight :
                        data.my[ 1 ] === "bottom" ?
                            data.elemHeight :
                            0,
                    atOffset = data.at[ 1 ] === "top" ?
                        data.targetHeight :
                        data.at[ 1 ] === "bottom" ?
                            -data.targetHeight :
                            0,
                    offset = -2 * data.offset[ 1 ],
                    newOverTop,
                    newOverBottom;
                if ( overTop < 0 ) {
                    newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight -
                        outerHeight - withinOffset;
                    if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
                        position.top += myOffset + atOffset + offset;
                    }
                } else if ( overBottom > 0 ) {
                    newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset +
                        offset - offsetTop;
                    if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
                        position.top += myOffset + atOffset + offset;
                    }
                }
            }
        },
        flipfit: {
            left: function() {
                positions.flip.left.apply( this, arguments );
                positions.fit.left.apply( this, arguments );
            },
            top: function() {
                positions.flip.top.apply( this, arguments );
                positions.fit.top.apply( this, arguments );
            }
        }
    };

    return geom.posit = posit;
});