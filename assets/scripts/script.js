const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')

const app = {
    currentIndex: 0,
    isRandom: false,
    isPlaying: false,
    songs: [
        {
            name: 'Blueming',
            singer: 'IU',
            path: './assets/music/blueming.mp3',
            image: './assets/img/img_blueming.jpg',
        },
        {
            name: 'Eight',
            singer: 'IU',
            path: './assets/music/eight.mp3',
            image: './assets/img/img_eight.jpg',
        },
        {
            name: 'Celebrity',
            singer: 'IU',
            path: './assets/music/celebrity.mp3',
            image: './assets/img/img_celebrity.jpg',
        },
        {
            name: 'Love Poem',
            singer: 'IU',
            path: './assets/music/lovepoem.mp3',
            image: './assets/img/img_lovepoem.jpg',
        },
        {
            name: 'BBiBBi',
            singer: 'IU',
            path: './assets/music/bbibbi.mp3',
            image: './assets/img/img_bbibbi.jpg',
        },
        {
            name: 'above the time',
            singer: 'IU',
            path: './assets/music/abovethetime.mp3',
            image: './assets/img/img_abovethetime.jpg',
        },
        {
            name: 'LILAC',
            singer: 'IU',
            path: './assets/music/lilac.mp3',
            image: './assets/img/img_lilac.jpg',
        },
        {
            name: 'Palette',
            singer: 'IU',
            path: './assets/music/palette.mp3',
            image: './assets/img/img_palette.jpg',
        },
        {
            name: 'Strawberry moon',
            singer: 'IU',
            path: './assets/music/strawberrymoon.mp3',
            image: './assets/img/img_strawberrymoon.jpg',
        },
        {
            name: 'Twenty Three',
            singer: 'IU',
            path: './assets/music/twentythree.mp3',
            image: './assets/img/img_twentythree.jpg',
        },
    ],
    render: function () {
        const htmls = this.songs.map(songs => {
            return `
                <div class="song">
                    <div class="thumb"
                        style="background-image: url('${songs.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${songs.name}</h3>
                        <p class="author">${songs.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })

        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10s
            iterations: Infinity 
        })
        cdThumbAnimate.pause()

        // Xử lý kích thước CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth 
        }

        // khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ song thay đỗi
        audio.ontimeupdate = function () {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent 

        }

        // khi tua song
        progress.oninput = function (e) {
            const seakTime = audio.duration / 100 * e.target.value
            audio.currentTime = seakTime
        }

        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
        }

        // Khi previous song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
        }
        
        // Xử lý bật/tắt Random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex) {
            this.currentIndex = newIndex
        }
        this.loadCurrentSong()
    },
    
    start: function () {
        // Định nghĩa các thuộc tính
        this.defineProperties()

        // Xử lý sự kiện
        this.handleEvent()

        // Tải thông tin bài hát hiện tại
        this.loadCurrentSong()

        // Render danh sách bài hát
        this.render()
    },
}
app.start()