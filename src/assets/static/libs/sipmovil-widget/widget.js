var sipmovilScript = document.currentScript;
var sipmovilToken = sipmovilScript.dataset.token;
var widgetHost = window.location.hostname;
var sipmovilHost = sipmovilScript.dataset.host;

window.onload = async function () {
  
  body = document.getElementsByTagName('body')[0]
  htmlContent = `<audio id='audioRemote' autoplay></audio><audio id='dtmfTone' src='${sipmovilHost}/static/libs/phone/sounds/dtmf.mp3'></audio><button class='btn btn-primary sipmovil-call-button callButton sipmovil-br sipmovil-target-area' number='' text='' data-original-title='Llamar' data-toggle='tooltip'><i class='fas fa-headset'></i></button><div class='sipmovil-call-option-container sipmovil-br' hidden=''><ul class='sipmovil-list-options'></ul></div><div class='sipmovil-caller-container' hidden=''><div class='sipmovil-caller-header sipmovil-target-area'><div class='company-avatar'><img src=''></div><div class='sipmovil-company-text'></div><div class='header-icons'><span class='float-right' id='sipmovil-caller-dismiss' title='Minimizar'><i class='fas fa-minus  mr-1'></i></span></div></div><div class='sipmovil-caller-content'><div class='sipmovil-container-info'  hidden=''><div class='sipmovil-main-message'></div><div class='sipmovil-secondary-message'></div><div class='sipmovil-button-close sipmovil-target-area'><span>Cerrar</span></div></div><div class='sipmovil-call-screen'> <div class='sipmovilcall-main-container'><div class='sipmovil-avatar-container'><img src=''></div><div class='sipmovil-dialpad'><div class='key-row'><div class='dial-key' data-digit='1'>1</div><div class='dial-key' data-digit='2'>2</div><div class='dial-key' data-digit='3'>3</div></div><div class='key-row'><div class='dial-key' data-digit='4'>4</div><div class='dial-key' data-digit='5'>5</div><div class='dial-key' data-digit='6'>6</div></div><div class='key-row'><div class='dial-key' data-digit='7'>7</div><div class='dial-key' data-digit='8'>8</div><div class='dial-key' data-digit='9'>9</div></div><div class='key-row'><div class='dial-key' data-digit='*'>*</div><div class='dial-key' data-digit='0'>0</div><div class='dial-key' data-digit='#'>#</div></div></div></div><div class='button-container'><div class='btnMute rounded-button' active='no'><i class='fas fa-microphone'></i></div><div class='btnVolume rounded-button'><i class='fas fa-volume-up'></i></div><div class='volumeControl'><input id='sipmovil-volume-control' class='slider sipmovil-range-bg' type='range' min='1' max='100' value='100' disabled=''></div><div class='btnDialpad rounded-button' active='no'><i class='fas fa-th'></i></div><div class='btnHangup rounded-button' active='no'><i class='fas fa-phone-slash'></i></div></div><div class='sipmovil-timer-container'><span id='sipmovil-timer'>00:00</span></div></div></div></div>`
  body.insertAdjacentHTML('beforeend', htmlContent)

  // load necesary styles
  bootstrapStyles = document.createElement('link')
  bootstrapStyles.setAttribute('href', 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css')
  bootstrapStyles.setAttribute('rel', 'stylesheet')
  document.getElementsByTagName('head')[0].appendChild(bootstrapStyles)

  fontawesomeStyles = document.createElement('link')
  fontawesomeStyles.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/solid.min.css')
  fontawesomeStyles.setAttribute('rel', 'stylesheet')
  document.getElementsByTagName('head')[0].appendChild(fontawesomeStyles)

  widgetStyles = document.createElement('link')
  widgetStyles.setAttribute('href', `${sipmovilHost}/static/libs/sipmovil-widget/widget.css`)
  widgetStyles.setAttribute('rel', 'stylesheet')
  document.getElementsByTagName('head')[0].appendChild(widgetStyles)

  // load necesary scripts
  popperScript = document.createElement('script')
  popperScript.setAttribute('src', `https://${sipmovilHost}/static/libs/bootstrap/js/popper.min.js`)
  document.getElementsByTagName('head')[0].appendChild(popperScript)

  momentScript = document.createElement('script')
  momentScript.setAttribute('src', `${sipmovilHost}/static/libs/moment.js`)
  document.getElementsByTagName('head')[0].appendChild(momentScript)

  sipScript = document.createElement('script')
  sipScript.setAttribute('src', `${sipmovilHost}/static/libs/phone/sip.min.js`)
  document.getElementsByTagName('head')[0].appendChild(sipScript)

  fontawesomeScript = document.createElement('script')
  fontawesomeScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/js/all.min.js')
  document.getElementsByTagName('head')[0].appendChild(fontawesomeScript)

  jqScript = document.createElement('script')
  jqScript.setAttribute('type', 'text/javascript')
  jqScript.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js')
  jqScript.onload = function () {
    bootstrapScript = document.createElement('script')
    bootstrapScript.setAttribute('src', 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js')
    bootstrapScript.onload = function () {
      var callTimer;
      var widgetUser
      $('[data-toggle="tooltip"]').tooltip()

      renderCallWidget()

      function traceLog (message, type) {
        strType = ''
        switch (type) {
          case 1:
            strType = 'INFO'
            break
          case 2:
            strType = 'ERROR'
            break
          case 3:
            strType = 'SUCCESS'
            break
        }
        console.log('[' + strType + '] ' + moment().format('YYYY/MM/DD h:mm:ss --> ') + message)
      }

      function setMainError (title, msg) {
        $('.sipmovil-call-button').empty()
        $('.sipmovil-call-button').append("<i class='fas fa-exclamation-triangle'></i>");
        $('.sipmovil-call-button').removeClass('btn-primary').addClass('btn-danger');
        $('.sipmovil-call-button').attr('data-original-title', msg);
        $('.sipmovil-call-button').prop('disabled', true);
      }

      function renderCallWidget () {
        $.ajax({
          type: 'POST',
          url: `${sipmovilHost}/widget/`,
          async: false,
          data: {
            token: sipmovilToken,
            host: widgetHost
          },
          success: function (resp) {
            console.log(resp)
            if (!resp.error) {
              colors = resp.colors
              // Add color styles to document
              var style = document.createElement('style')
              style.setAttribute('data', 'sipmovil-widget')
              document.getElementsByTagName('head')[0].appendChild(style)
              style = document.querySelector('[data="sipmovil-widget"]')
              target_area = `.sipmovil-target-area{background: ${colors.main_color} !important;color: ${colors.text_color} !important;border-color: ${colors.main_color} !important;}`
              button_focus = `.sipmovil-call-button:active,.sipmovil-call-button:hover,.sipmovil-call-button:focus{box-shadow: 0 0 0 0.2rem ${colors.main_color}80!important}`
              range_style = `.sipmovil-range-bg::-webkit-slider-thumb {box-shadow: -100vw 0 0 100vw ${colors.slider_color} !important}`
              style.innerHTML = target_area + range_style + button_focus
              // render widget elments
              text = resp.text
              $('.sipmovil-company-text').text(text.header)
              images = resp.images
              $('.company-avatar img').attr('src', images.avatar)
              $('.sipmovil-avatar-container img').attr('src', images.brand)
              // render extension(s)
              extensions = resp.extensions
              $('.sipmovil-list-options').empty()
              $('.sipmovil-call-button').attr('number', '')
              $('.sipmovil-call-button').attr('text', '')
              if (extensions.length == 1) {
                $('.sipmovil-call-button').attr('number', extensions[0].extension)
                $('.sipmovil-call-button').attr('text', extensions[0].name)
                if ($('.sipmovil-call-option-container').css('display') == 'block') {
                  $('.sipmovil-call-option-container').prop('hidden', true)
                  $('.sipmovil-call-button').empty()
                  $('.sipmovil-call-button').append("<i class='fas fa-headset'></i>")
                }
              } else if (extensions.length > 1) {
                strAdd = ''
                for (var i = 0; i < extensions.length; i++) {
                  strAdd += "<li class='sipmovil-call-option' number='" + extensions[i].extension + "'>" + extensions[i].name + '</li>'
                }
                $('.sipmovil-list-options').append(strAdd)
              }
              widgetUser = resp.account
              // load pjsip account
              executeSipmovilConnection()
            } else {
              console.log(resp.error)
              setMainError('Error', resp.error)
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            // Todo on failed action
          }
        })
      }

      function finishCall (mainMess = 'Llamada terminada', secondMess = 'La llamada ha finalizado') {
        $('.btnDialpad').removeClass('sipmovil-toggled')
        $('.sipmovil-avatar-container').removeClass('sipmovil-toggled')
        $('.sipmovil-dialpad').removeClass('sipmovil-toggled')
        $('.sipmovil-call-screen').prop('hidden', true)
        $('.sipmovil-container-info').prop('hidden', false)
        $('#sipmovil-volume-control').prop('disabled', true)
        $('.btnHangup').attr('active', 'no')
        $('.btnMute').attr('active', 'no')
        $('.sipmovil-call-button').empty()
        $('.sipmovil-call-button').append("<i class='fas fa-headset'></i>")
        $('.sipmovil-main-message').text(mainMess)
        $('.sipmovil-secondary-message').text(secondMess)
        $('#sipmovil-timer').text('00:00')
        StopTimer()
      }

      
      function initTimer () {
        timeInit = 0
        callTimer = setInterval(function () {
          timeInit += 1
          minutes = String(Math.trunc(timeInit / 60))
          seconds = String(timeInit % 60)
          strTime = minutes.length == 1 ? '0' + minutes : minutes
          strTime += ':'
          strTime += seconds.length == 1 ? '0' + seconds : seconds
          console.log('strTime: ' + strTime)
          formatTimeInit = strTime
          $('#sipmovil-timer').text(strTime)
        }, 1000)
      }

      function StopTimer () {
        console.log('into function StopTimer', callTimer)
        clearInterval(callTimer)
      }

      function executeSipmovilConnection () {
        $('.dial-key').click(function (event) {
          event.preventDefault()
          var dig = $(this).data('digit')
          ctxSip.sipSendDTMF(dig)
          return false
        })

        $('.btnMute').click(function (event) {
          $(this).toggleClass('sipmovil-toggled')
          isActive = $(this).attr('active')
          if (isActive == 'yes') {
            var sessionid = ctxSip.callActiveID
            ctxSip.phoneMuteButtonPressed(sessionid)
          }
          return false
        })

        $(document).on('click', '.sipmovil-call-button', function (e) {
          number = $(this).attr('number')
          if (number != '' && $('.sipmovil-call-option').length == 0) {
            $('.sipmovil-call-button').prop('hidden', true)
            $('.sipmovil-call-option-container').prop('hidden', true)
            $('.sipmovil-caller-container').prop('hidden', false)
            ctxSip.sipCall(number)
          } else if ($('.sipmovil-call-option').length > 1) {
            $('.sipmovil-call-button').empty()
            if ($('.sipmovil-call-option-container').css('display') == 'block') {
              $('.sipmovil-call-button').append("<i class='fas fa-headset'></i>")
              $('.sipmovil-call-option-container').prop('hidden', true)
            } else {
              $('.sipmovil-call-button').append("<i class='fas fa-times'></i>")
              $('.sipmovil-call-option-container').prop('hidden', false)
            }
          }
        })

        $(document).on('click', '.sipmovil-call-option', function (e) {
          e.preventDefault()
          $('.sipmovil-call-button').prop('hidden', true)
          $('.sipmovil-call-option-container').prop('hidden', true)
          $('.sipmovil-caller-container').prop('hidden', false)
          ctxSip.sipCall($(this).attr('number'))
        })

        $('.btnDialpad').click(function (e) {
          $(this).toggleClass('sipmovil-toggled')
          $('.sipmovil-avatar-container').toggleClass('sipmovil-toggled')
          $('.sipmovil-dialpad').toggleClass('sipmovil-toggled')
        })

        $('.btnHangup').click(function (e) {
          isActive = $(this).attr('active')
          if (isActive == 'yes') {
            ctxSip.sipHangUp(ctxSip.callActiveID)
            finishCall()
          }
        })

        $('#sipmovil-volume-control').on('change', function () {
          var v = $(this).val() / 100
          var active = ctxSip.callActiveID

          if (ctxSip.Sessions[active]) {
            // ctxSip.Sessions[active].player.volume = v;
            ctxSip.callVolume = v
          }
          // Set the others
          $('audio').each(function () {
            $(this).get()[0].volume = v
          })
        })

        $('.sipmovil-button-close').click(function (e) {
          $('.sipmovil-caller-container').prop('hidden', true)
          $('.sipmovil-call-button').prop('hidden', false)
          $('.sipmovil-call-screen').prop('hidden', false)
          $('.sipmovil-container-info').prop('hidden', true)
        })

        $('#sipmovil-caller-dismiss').click(function (e) {
          $('.sipmovil-caller-content').toggleClass('sipmovil-toggled')
          $('.sipmovil-caller-container').toggleClass('sipmovil-toggled')
          $(this).prop('hidden', true)
          $('.sipmovil-caller-header').toggleClass('sipmovil-header-dismiss')
          e.stopPropagation()
        })

        $(document).on('click', '.sipmovil-header-dismiss', function (e) {
          $('.sipmovil-caller-content').toggleClass('sipmovil-toggled')
          $('.sipmovil-caller-container').toggleClass('sipmovil-toggled')
          $('.sipmovil-caller-header').toggleClass('sipmovil-header-dismiss')
          $('#sipmovil-caller-dismiss').prop('hidden', false)
        })

        // setting for register pjsip account
        ctxSip = {
          config: {
            password: widgetUser.Pass,
            displayName: widgetUser.Display,
            uri: 'sip:' + widgetUser.User + '@' + widgetUser.Realm,
            wsServers: widgetUser.WSServer,
            stunServers: ['stun:stun.l.google.com:19302'],
            registerExpires: 30,
            traceSip: true,
            log: {
              level: 0
            }
          }, // end config
          Sessions: [],
          dtmfTone: document.getElementById('dtmfTone'),
          callVolume: 1,

          newSession: function (newSess) {
            console.log('entro funcion newSession: ' + newSess)
            console.log(newSess)
            newSess.displayName = newSess.remoteIdentity.displayName || newSess.remoteIdentity.uri.user
            newSess.ctxid = ctxSip.getUniqueID()
            ctxSip.callActiveID = newSess.ctxid
            $('.btnHangup').attr('active', 'yes')

            newSess.on('accepted', function (e) {
              traceLog('Session accepted', 1)

              $('.btnMute').attr('active', 'yes')
              $('#sipmovil-volume-control').prop('disabled', false)
              initTimer()

              var stream2 = this.mediaHandler.getRemoteStreams()[0]

              if (ctxSip.callActiveID && ctxSip.callActiveID !== newSess.ctxid) {
                ctxSip.phoneHoldButtonPressed(ctxSip.callActiveID)
              }
              ctxSip.callActiveID = newSess.ctxid
            }) // End session accepted

            newSess.on('cancel', function (e) {
              traceLog('Session canceled', 1)
              finishCall('Llamada cancelada', 'Recuerda que estamos para servirte')
              if (this.direction === 'outgoing') {
                ctxSip.callActiveID = null
                newSess = null
              }
            }) // End session cancel

            newSess.on('bye', function (e) {
              traceLog('Session bye', 1)
              finishCall()
              ctxSip.callActiveID = null
              newSess = null              
            }) // End session bye

            newSess.on('rejected', function (e) {
              traceLog('Session rejected', 1)
              finishCall('Llamada rechazada', 'En estos momentos no podemos atenderte, intenta más tarde')
              ctxSip.callActiveID = null
              newSess = null
            }) // End session rejected

            newSess.on('muted', function (e) {
              traceLog('Evento muted', 1)
              ctxSip.Sessions[newSess.ctxid].isMuted = true
            }) // End session muted

            newSess.on('unmuted', function (e) {
              traceLog('Evento unmuted', 1)
              ctxSip.Sessions[newSess.ctxid].isMuted = false
            }) // End session unmuted

            ctxSip.Sessions[newSess.ctxid] = newSess
          }, // End newSession

          getUniqueID: function () {
            return Math.random().toString(36).substr(2, 9)
          }, // End getUniqueID

          getUserMediaFailure: function (e) {
            console.log('function getUserMediaFailure')
            // window.console.error('getUserMedia failed:', e);
            // ctxSip.setError(true, 'Sin micrófono.', 'No detectamos tu micrófono, revisa que esté habilitado en tu navegador, revisa la barra de direcciones.', true);
          }, // End getUserMediaFailure

          getUserMediaSuccess: function (stream) {
            console.log('function getUserMediaSuccess')
            console.log(stream)
            ctxSip.Stream = stream
          }, // End getUserMediaSuccess

          sipCall: function (target) {
            console.log('entro funcion sipCall: ' + target)
            try {
              var s = ctxSip.phone.invite(target, {
                media: {
                  stream: ctxSip.Stream,
                  constraints: { audio: true, video: false },
                  render: {
                    remote: $('#audioRemote').get()[0]
                  },
                  RTCConstraints: { optional: [{ DtlsSrtpKeyAgreement: 'true' }] }
                }
                // rel100: SIP.C.supported.SUPPORTED,
                // inviteWithoutSdp: true
              })
              s.direction = 'outgoing'
              ctxSip.newSession(s)
            } catch (e) {
              throw (e)
            }
          }, // End sipCall

          sipHangUp: function (sessionid) {
            var s = ctxSip.Sessions[sessionid]
            // s.terminate();
            if (!s) {

            } else if (s.startTime) {
              s.bye()
            } else if (s.reject) {
              s.reject()
            } else if (s.cancel) {
              s.cancel()
            }
          }, // End sipHangUp

          sipSendDTMF: function (digit) {
            try { ctxSip.dtmfTone.play() } catch (e) { }
            var a = ctxSip.callActiveID
            if (a) {
              var s = ctxSip.Sessions[a]
              s.dtmf(digit)
            }
          }, // End sipSendDTMF

          phoneCallButtonPressed: function (sessionid) {
            var s = ctxSip.Sessions[sessionid]
            // target = $("#numDisplay").val();

            if (!s) {
              ctxSip.sipCall(target)
            } else if (s.accept && !s.startTime) {
              s.accept({
                media: {
                  stream: ctxSip.Stream,
                  constraints: { audio: true, video: false },
                  render: {
                    remote: $('#audioRemote').get()[0]
                  },
                  RTCConstraints: { optional: [{ DtlsSrtpKeyAgreement: 'true' }] }
                }
              })
            }
          }, // End phoneCallButtonPressed

          phoneMuteButtonPressed: function (sessionid) {
            var s = ctxSip.Sessions[sessionid]
            if (!s.isMuted) {
              s.mute()
            } else {
              s.unmute()
            }
          }, // End phoneHoldButtonPressed

          phoneHoldButtonPressed : function(sessionid) {
            console.log("sessionid: "+sessionid)
            var s = ctxSip.Sessions[sessionid];
            console.log(s)
            console.log("s.isOnHold().local: "+s.isOnHold().local)
            if (s.isOnHold().local === true) {
                console.log("entro s.unhold")
                s.unhold();
            } else {
                s.hold();
                console.log("entro s.hold")
            }
          },

          hasWebRTC: function () {
            console.log('in function hasWebRTC')
            if (navigator.webkitGetUserMedia) {
              return true
            } else if (navigator.mozGetUserMedia) {
              return true
            } else if (navigator.getUserMedia) {
              return true
            } else {
              ctxSip.setError('Error', 'Navegador no soportado.');              
              return false
            }
          }, // End hasWebRT

          setError: function (title, msg) {
            window.console.error(msg);
            setMainError(title, msg);
          }, // End setError

          removeError: function () {
            $('.sipmovil-call-button').removeClass('btn-danger').addClass('btn-primary')
            $('.sipmovil-call-button').attr('data-original-title', 'Llamar')
            $('.sipmovil-call-button').prop('disabled', false)
          }
        } // end ctxSip

        // Throw an error if the browser can't hack it.
        webRTCSupported = ctxSip.hasWebRTC();

        if (webRTCSupported == true){
          ctxSip.phone = new SIP.UA(ctxSip.config)

          ctxSip.phone.on('connected', function (e) {
            traceLog('WEBRTC connected ', 1)
            ctxSip.removeError()
          }) // End phone connected

          ctxSip.phone.on('disconnected', function (e) {
            ctxSip.setError(true, 'Desconectado.', 'Desconectado. Recargue la página para continuar llamando.')
          }) // End phone disconnected

          ctxSip.phone.on('registrationFailed', function (e) {
            traceLog('WEBRTC registrationFailed ', 1)
            ctxSip.setError('Desconectado.', 'Error: Registro fallido')
          })

          ctxSip.phone.on('unregistered', function (e) {
            traceLog('WEBRTC unregistered ', 1)
          }) // End phone unregistered

          ctxSip.phone.on('registered', function (e) {
            traceLog('WEBRTC registered ', 1)
            // Get the userMedia and cache the stream
            if (SIP.WebRTC.isSupported()) {
              SIP.WebRTC.getUserMedia({ audio : true, video : false }, ctxSip.getUserMediaSuccess, ctxSip.getUserMediaFailure);
            }
          }) // End phone registered
        }

        
      }
    }
    document.getElementsByTagName('head')[0].appendChild(bootstrapScript)
  }
  document.getElementsByTagName('head')[0].appendChild(jqScript)
}