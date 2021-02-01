// import jQuery from 'jquery';
// import plyr from 'plyr';

// const $ = jQuery;

// function init() {
//     $('.button-video').hover(function () {
//         $(this).siblings('.video-overlay').toggleClass('hover');
//     });


//     // SHOW VIDEO PLAYER MODAL & INIT VIDEO PLAYER

//     let videoPlayer;

//     $('.button-video').click(function (e) {
//         e.preventDefault();
//         $('body').addClass('modal-active');
//         document.ontouchmove = function (event) {
//             event.preventDefault();
//         };
//         const href = $(this).attr('href');
//         const videoProvider = $(this).data('video-service');
//         $('#player').attr('data-video-id', href).attr('data-type', videoProvider);

//         if ($('.plyr').length === 0) {
//             videoPlayer = plyr.setup([
//                 document.querySelector('.js-player'),
//             ], {
//                 autoplay: true,
//                 fullscreen: {
//                     fallback: true,
//                     allowAudio: true,
//                     enabled: true,
//                 },
//                 controls: ['play', 'progress', 'mute', 'fullscreen'],
//             });
//         }
//         if ($(window).width() <= 768) {
//             videoPlayer[0].on('exitfullscreen', function () {
//                 $('body').removeClass('modal-active');
//                 document.ontouchmove = function () {
//                     return true;
//                 };
//                 $('.video-modal').removeClass('visible');
//                 videoPlayer[0].destroy();
//             });
//         }
//         videoPlayer[0].play();
//         $('.video-modal').addClass('visible');
//     });

//     // END VIDEO PLAYER MODAL


//     // CLOSE VIDEO MODAL

//     $('.close-modal').click(function (e) {
//         if ($('.plyr').has(e.target).length === 0) {
//             $('body').removeClass('modal-active');
//             document.ontouchmove = function () {
//                 return true;
//             };
//             $('.video-modal').removeClass('visible');
//             videoPlayer[0].destroy();
//             // if ($(window).width() < 768) {
//             //     $('.video-wrap').removeClass('video-active');
//             //     $('.video-modal').removeClass('visible');
//             //     videoPlayer[0].destroy();
//             // } else if ($('#player').length > 0) {
//             //     const player = $('.plyr');
//             //     if (player.has(e.target).length === 0) {
//             //         $('.video-wrap').removeClass('video-active');
//             //         $('.video-modal').removeClass('visible');
//             //         videoPlayer[0].destroy();
//             //     }
//             // }
//         }
//     });

// }

// export default {
//     init,
// };
