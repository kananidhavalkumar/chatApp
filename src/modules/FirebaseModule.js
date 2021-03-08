
export const doLogin = async (username, database, handleUpdate) => {
  
await  database.collection('/notifs').doc(username).set({})
//   database.collection('/notifs').doc(username).onSnapshot((doc) => {
   
//     doc.exists && handleUpdate(doc.data(), username);
   
// });

  // await database.collection('/notifs/' + username).remove()
  // database.ref('/notifs/' + username).on('value', snapshot => {
  //   snapshot.exists() && handleUpdate(snapshot.val(), username)
  // })
}

export const doOffer = async (to, offer, database, username) => {
  await database.collection('/notifs').doc(to).set({
    type: 'offer',
    from: username,
    offer: JSON.stringify(offer)
  })
}

export const doAnswer = async (to, answer, database, username) => {
  await  database.collection('/notifs').doc(to).update({
    type: 'answer',
    from: username,
    answer: JSON.stringify(answer)
  })
}

export const doLeaveNotif = async (to, database, username) => {
  await  database.collection('/notifs').doc(to).update({
    type: 'leave',
    from: username
  })
}

export const doCandidate = async (to, candidate, database, username) => {
  // send the new candiate to the peer
  
  await  database.collection('/notifs').doc(to).update({
    type: 'candidate',
    from: username,
    candidate: JSON.stringify(candidate)
  })
}
