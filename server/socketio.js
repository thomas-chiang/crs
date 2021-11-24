module.exports = function(io) {
    io.on('connection', socket => {
        console.log('new ws connection...');

        socket.on('changeCourseUsers', ({socketId}) => {
            io.emit('updateCourseUsers', {
                socketId
            });
            console.log('Sb changes CourseUsers')
        })

        socket.on('changeCourses', ({socketId}) => {
            io.emit('updateCourses', {
                socketId
            });
            console.log('Sb changes Courses')
        })

        socket.on('changeUsers', ({socketId}) => {
            io.emit('updateUsers', {
                socketId
            });
            console.log('Sb changes Users')
        })

        socket.on('disconnect', () => {
            console.log('some ws disconnected');
        })
    });
}
